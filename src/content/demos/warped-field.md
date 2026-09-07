---
title: 'Domain-Warped Field'
description: 'An animated fragment shader that warps a sum of sine fields by a second evaluation of itself.'
component: 'shader'
tech: ['WebGL2', 'GLSL']
draft: false
---

Seed demo. The frame above is a real WebGL2 fragment shader — the pattern it establishes
is the point:

- Nothing loads until the frame is about to scroll into view.
- The renderer is a **separate JS chunk**, fetched on intersection. Pages with no demo
  never download it.
- It pauses when scrolled away or when the tab is backgrounded.
- With `prefers-reduced-motion: reduce`, it draws one static frame and stops.
- Without WebGL2 support, the poster image stays put and nothing errors.

## How the shader works

Two evaluations of the same sine-sum field. The first produces a smooth scalar field; the
second uses that field's output to offset its own input coordinates, which breaks up the
regularity of the sines into something that reads as fluid:

```glsl
vec2 warp = vec2(
  field(uv + vec2(1.3, 0.7), u_time),
  field(uv - vec2(0.8, 1.1), u_time)
);
float v = field(uv + warp * 0.9, u_time);
```

Geometry is a single fullscreen triangle generated from `gl_VertexID`, so there are no
attribute buffers and no vertex data to upload.

## Adding another demo

1. Write the renderer in `src/components/demos/`.
2. Register it in the `RENDERERS` map in `src/pages/demos/[...slug].astro`.
3. Add a markdown entry here with a matching `component` value.

If `component` doesn't match a registered renderer, the build fails with the list of
valid names rather than rendering an empty frame.
