import bpy
from pathlib import Path
p=Path(__file__).resolve().parent
bpy.ops.wm.open_mainfile(filepath=str(p.parent/'stone-panel-posters-800x2400-20260926/800x2400-整板构造.blend'))
for o in bpy.context.scene.objects:
 o.select_set(False)
for o in bpy.context.scene.objects:
 if o.type in {'MESH','CURVE'}:
  o.hide_set(False);o.hide_render=False;o.select_set(True);o['sourceName']=o.name
front=bpy.data.objects['实拍纹理面'];m=bpy.data.materials.new('网页实拍纹理');m.use_nodes=True;front.data.materials.clear();front.data.materials.append(m)
bpy.context.view_layer.objects.active=front
bpy.ops.export_scene.gltf(filepath=str(p/'site/assets/panel.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True,export_cameras=False,export_lights=False,export_animations=False)
