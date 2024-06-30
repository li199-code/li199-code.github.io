---
title: mastodon
date: 2024-06-30 23:01:16
---

<script src="https://cdn.jsdelivr.net/npm/@idotj/mastodon-embed-timeline@4.4.2/dist/mastodon-timeline.umd.js" integrity="sha256-E6WPG6iq+qQIzvu3HPJJxoAeRdum5siq13x4ITjyxu8=" crossorigin="anonymous"></script>

<div class="dummy-wrapper-timeline">
  <!-- Mastodon Timeline -->
  <div id="mt-container" class="mt-container">
    <div class="mt-body" role="feed">
      <div class="mt-loading-spinner"></div>
    </div>
  </div>
</div>

<script>
    const myTimeline = new MastodonTimeline.Init({
        instanceUrl: "https://mastodon.social",
        timelineType: "profile",
        userId: "112661014878347546",
        profileName: "@xiaolee",
    });
</script>
