<div align="center">
  <h3>
    <img width="400" alt="glitch-image" src="https://glitch-image.vercel.app/api?seed=429636">
  </h3>
  <p align="center">Copy-paste this into your markdown content, and that's it. Simple!</p>
</div>

## Setup

Change the `?text=` value to your want to glitch text.

```md
[![badge](https://glitch-image.vercel.app/api?text=Glitch%20Image)](https://glitch-image.vercel.app/api?text=Glitch%20Image)
```

### Image

Change the `?url=` value to your want to glitch image url.

```md
[![badge](https://glitch-image.vercel.app/api?url=https://github.com/ivgtr.png)](https://glitch-image.vercel.app/api?url=https://github.com/ivgtr.png)
```

## Parameters

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| `text` | Glitch text (1-200 chars) | `Glitch Image` | `?text=Hello` |
| `url` | Image URL to glitch | - | `?url=https://example.com/img.png` |
| `width` | SVG width (1-4096) | auto | `?width=600` |
| `height` | SVG height (1-4096) | auto | `?height=400` |
| `color` | Text color (hex, without `#`) | `3f3f3f` | `?color=ff0000` |
| `darkColor` | Text color for dark mode (hex, without `#`) | `f3f3f3` | `?darkColor=cccccc` |
| `fontSize` | Font size (1-500) | `10` | `?fontSize=48` |
| `seed` | Seed for glitch pattern (0-2147483647) | time-based | `?seed=429636` |

## License

MIT ©[ivgtr](https://github.com/ivgtr)

[![Twitter Follow](https://img.shields.io/twitter/follow/ivgtr?style=social)](https://twitter.com/ivgtr) [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
