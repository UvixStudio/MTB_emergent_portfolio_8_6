# Closed conveyor chambers

- Live Blender MCP source: `C:/Ai/Mtb_portfolio/3d/workshop4.blend` (not workshop.blend).
- Backed up the live scene including unsaved edits to `before-closed-gate-backs-20260924-193712.blend` before changing it.
- Saved two solid chamfered rear panels, matte inner casing materials, extended belt/rails, and continuous animated UV spacing into workshop4.blend.
- Both chamber rays hit their rear panels during validation.
- Current live Blender scene differs from the accepted HTML GLB in unrelated architectural details. Do not blindly replace the whole preview with a fresh live export.
- `update_preview_gates.py` transferred only the nine repaired conveyor meshes, two added panels, and hidden rear portal trim into the prior accepted GLB. All unrelated preview nodes/materials were preserved.
- Served result: `workshop-current.glb`, 803868 bytes. Browser reports 206 meshes and 16034 triangles. Rear-view visual check passed; no browser errors reported at verification.
- Original preview is `before-closed-gate-backs-20260924-193712.glb`. The transfer script expects the raw live export as its input; do not rerun it against the already merged result.
- Public repository `frontend/public/models/workshop.glb` remains unchanged. Local preview server overrides this route with workshop-current.glb.
