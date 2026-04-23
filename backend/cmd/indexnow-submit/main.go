package main

import (
	"bytes"
	"encoding/json"
	"encoding/xml"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

type IndexNowRequest struct {
	Host        string   `json:"host"`
	Key         string   `json:"key"`
	KeyLocation string   `json:"keyLocation"`
	URLList     []string `json:"urlList"`
}

type Urlset struct {
	URLs []struct {
		Loc     string `xml:"loc"`
		LastMod string `xml:"lastmod"`
	} `xml:"url"`
}

const (
	endpointBing   = "https://www.bing.com/indexnow"
	endpointYandex = "https://yandex.com/indexnow"
)

func main() {
	var (
		sitemap = flag.String("sitemap", "", "URL sitemap.xml (optional)")
		urls    = flag.String("urls", "", "comma-separated URLs")
		days    = flag.Int("recent", 0, "from sitemap: only URLs with lastmod in last N days")
		engine  = flag.String("engine", "bing", "bing | yandex | both")
		dryRun  = flag.Bool("dry-run", false, "preview without sending")
	)
	flag.Parse()

	key := os.Getenv("INDEXNOW_KEY")
	keyLoc := os.Getenv("INDEXNOW_KEY_LOCATION")
	host := os.Getenv("INDEXNOW_HOST")
	if key == "" || keyLoc == "" || host == "" {
		fmt.Fprintln(os.Stderr, "Error: set INDEXNOW_KEY, INDEXNOW_KEY_LOCATION, INDEXNOW_HOST")
		os.Exit(1)
	}

	var list []string
	switch {
	case *urls != "":
		list = splitCSV(*urls)
	case *sitemap != "":
		list = fromSitemap(*sitemap, *days)
	default:
		fmt.Fprintln(os.Stderr, "Provide -urls or -sitemap")
		os.Exit(1)
	}

	if len(list) == 0 {
		fmt.Println("No URLs to submit")
		return
	}
	if len(list) > 10000 {
		fmt.Fprintln(os.Stderr, "Max 10000 URLs per request")
		os.Exit(1)
	}

	fmt.Printf("IndexNow: %d URLs\n", len(list))
	for i, u := range list {
		if i < 10 {
			fmt.Printf("  - %s\n", u)
		} else if i == 10 {
			fmt.Printf("  ... and %d more\n", len(list)-10)
			break
		}
	}
	if *dryRun {
		fmt.Println("(dry-run: nothing sent)")
		return
	}

	req := IndexNowRequest{Host: host, Key: key, KeyLocation: keyLoc, URLList: list}

	endpoints := []string{}
	switch *engine {
	case "bing":
		endpoints = []string{endpointBing}
	case "yandex":
		endpoints = []string{endpointYandex}
	case "both":
		endpoints = []string{endpointBing, endpointYandex}
	}
	for _, ep := range endpoints {
		submit(ep, req)
	}
}

func submit(endpoint string, req IndexNowRequest) {
	body, _ := json.Marshal(req)
	httpReq, _ := http.NewRequest("POST", endpoint, bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json; charset=utf-8")
	httpReq.Header.Set("User-Agent", "kuechen-indexnow/1.0")
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		fmt.Printf("ERR %s -> %v\n", endpoint, err)
		return
	}
	defer resp.Body.Close()
	respBody, _ := io.ReadAll(resp.Body)
	switch resp.StatusCode {
	case 200:
		fmt.Printf("OK  %s -> 200 (accepted)\n", endpoint)
	case 202:
		fmt.Printf("OK  %s -> 202 (queued)\n", endpoint)
	case 400:
		fmt.Printf("ERR %s -> 400: %s\n", endpoint, respBody)
	case 403:
		fmt.Printf("ERR %s -> 403: key mismatch. Verify %s returns exactly %s\n", endpoint, req.KeyLocation, req.Key)
	case 422:
		fmt.Printf("ERR %s -> 422: URLs dont belong to %s\n", endpoint, req.Host)
	case 429:
		fmt.Printf("WARN %s -> 429 too many requests\n", endpoint)
	default:
		fmt.Printf("WARN %s -> %d: %s\n", endpoint, resp.StatusCode, respBody)
	}
}

func splitCSV(s string) []string {
	var out []string
	for _, p := range strings.Split(s, ",") {
		if p = strings.TrimSpace(p); p != "" {
			out = append(out, p)
		}
	}
	return out
}

func fromSitemap(url string, recentDays int) []string {
	resp, err := http.Get(url)
	if err != nil {
		fmt.Fprintln(os.Stderr, "sitemap fetch error:", err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	var us Urlset
	xml.NewDecoder(resp.Body).Decode(&us)
	var out []string
	cutoff := time.Now().AddDate(0, 0, -recentDays)
	for _, u := range us.URLs {
		if recentDays > 0 && u.LastMod != "" {
			t, err := time.Parse("2006-01-02", u.LastMod[:10])
			if err != nil || t.Before(cutoff) {
				continue
			}
		}
		out = append(out, u.Loc)
	}
	return out
}
