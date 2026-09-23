"""Build desktop photograph/art derivatives from approved source exports.
Sources live outside Git; coordinates are at the 1400px reference scale.
No page UI or body-copy rasterization: all captions/navigation are HTML.
"""
from pathlib import Path
import argparse,json
from PIL import Image,ImageOps
import numpy as np
import cv2
import pillow_heif
pillow_heif.register_heif_opener(); cv2.setNumThreads(1)
Image.MAX_IMAGE_PIXELS=300000000
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source',type=Path,required=True,help='Directory containing references/ and originals/ from Drive')
parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[1]/'img'/'desktop')
args=parser.parse_args(); ROOT=args.source;OUT=args.output;OUT.mkdir(parents=True,exist_ok=True)
# Matching transforms use these consistently sized, correctly oriented working images.
(ROOT/'original-previews').mkdir(exist_ok=True)
for name in ['2560dpi.png','Ecomm.jpg','WRM3266-Edit.jpg','IMG_3794.jpg','IMG_0611.jpg']:
 im=ImageOps.exif_transpose(Image.open(ROOT/'originals'/name)).convert('RGB');im.thumbnail((1200,1600));im.save(ROOT/'original-previews'/(name+'.jpg'))
records=[]
def save(im,name,source,box=None):
 im=im.convert('RGB');im.thumbnail((2400,3600),Image.Resampling.LANCZOS);im.save(OUT/(name+'.webp'),'WEBP',quality=94,method=4)
 records.append(dict(asset=name+'.webp',source=source,reference_box_1400=box,size=im.size))
def ref_image(name):
 im=Image.open(ROOT/'references'/name);im.thumbnail((1400,10000),Image.Resampling.LANCZOS);bg=Image.new('RGBA',im.size,'white');bg.alpha_composite(im);return bg.convert('RGB')
def crop(source,name,box):
 im=Image.open(ROOT/'references'/source);scale=im.width/1400;im=im.crop(tuple(round(v*scale) for v in box));bg=Image.new('RGBA',im.size,'white');bg.alpha_composite(im.convert('RGBA'));save(bg,name,source,box)
def original(name,out):
 im=ImageOps.exif_transpose(Image.open(ROOT/'originals'/name));save(im,out,name)
def photo_clean(ref,name,box,regions,source=None,transform=None):
 im=np.array(ref_image(ref).crop(box)); mask=np.zeros(im.shape[:2],np.uint8)
 for x,y,x2,y2 in regions:mask[y:y2,x:x2]=255
 if source:
  src=np.array(Image.open(ROOT/'original-previews'/(source+'.jpg')).convert('RGB'))
  s,tx,ty=transform; M=np.array([[s,0,tx],[0,s,ty]],np.float32);replacement=cv2.warpAffine(src,M,(im.shape[1],im.shape[0]))
  im[mask>0]=replacement[mask>0]
 else:im=cv2.inpaint(im,mask,5,cv2.INPAINT_TELEA)
 save(Image.fromarray(im),name,ref+'; typography removed using '+(source or 'local photo texture'),box)
# Real original media, orientation applied. Original mobile assets are never overwritten.
for name,out in [('IMG_4585.heic','fish-workshop'),('IMG_0611.jpg','algae-sheets'),('IMG_9859.HEIC','purse-worn'),('IMG_8245.HEIC','loom'),('IMG_8111.HEIC','leather-stack'),('IMG_3794.jpg','ocean-scales')]:original(name,out)
photo_clean('desktop_Home.png','hero',(0,0,1400,2007),[(45,18,317,54),(655,15,744,87),(1300,19,1356,53),(596,395,799,465)],'2560dpi.png',(1.61398,.536,-798.598))
# Remove the credit from the photograph; it is rendered as selectable HTML.
im=Image.open(OUT/'hero.webp');a=np.array(im);mask=np.zeros(a.shape[:2],np.uint8);mask[1914:1943,1128:1340]=255;a=cv2.inpaint(a,mask,4,cv2.INPAINT_TELEA);save(Image.fromarray(a),'hero','2560dpi.png + reference photo extension')
crop('desktop_Home.png','purse-editorial',(28,2043,686,2918))
crop('desktop_Bookmark.png','bookmark',(64,75,645,747))
photo_clean('desktop_Home.png','bookmark-book',(0,3015,1400,3978),[(563,286,840,352)])
photo_clean('desktop_Home.png','tote',(0,4058,1400,4915),[(622,568,795,638)])
photo_clean('desktop_Salmon Purse.png','purse-front',(0,0,703,907),[(48,19,317,56),(656,10,703,85)],'Ecomm.jpg',(.696528,-70.237,-109.404))
for name,box in [('purse-strap',(0,907,703,1845)),('purse-grain',(4,1882,703,2406)),('purse-corner',(0,2446,703,3383)),('purse-hanging',(0,3383,695,4327))]:crop('desktop_Salmon Purse.png',name,box)
# Algae examples are individual artwork only; captions stay HTML.
crop('desktop_Mateiral Story copy 2.png','kanten',(70,1218,242,1340))
crop('desktop_Mateiral Story copy 2.png','sway',(304,1194,492,1380))
# Texture sampled from unlettered reference paper, not a tinted substitute.
crop('desktop_Mateiral Story.png','paper',(0,1100,1400,1460))
# Material landing photos have silhouette marks on them; derive a clean fish crop from gallery.
crop('desktop_Salmon Purse.png','fish-grain',(4,1882,703,2406))
# The source photo has the correct stitching; its crop is applied in CSS.
original('WRM3266-Edit.jpg','algae-stitch')
# Matched source-to-reference transforms (SIFT/RANSAC), keeping photos free of UI.
for src,name,size,matrix,gain in [
 (OUT/'purse-grain.webp','fish-grain',(700,876),[[.504775,0,-159.326],[0,.504775,-14.467]],.77),
 (ROOT/'original-previews'/'WRM3266-Edit.jpg.jpg','algae-stitch',(700,876),[[.830268,.010676,-139.183],[-.010676,.830268,-530.177]],.77),
 (ROOT/'original-previews'/'IMG_3794.jpg.jpg','ocean-scales',(1400,890),[[1.178612,0,-2.755],[0,1.178612,-525.585]],.78),
 (ROOT/'original-previews'/'IMG_0611.jpg.jpg','algae-story',(695,871),[[.585683,0,-7.407],[0,.585683,.220]],.94)]:
 a=cv2.imread(str(src));a=cv2.warpAffine(a,np.array(matrix,np.float32),size,borderMode=cv2.BORDER_REPLICATE);a=np.clip(a*gain,0,255).astype(np.uint8);save(Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB)),name,str(src.name)+'; reference-matched crop')
# WRM World photographic/editorial artwork absent from original-media folder.
photo_clean('desktop_WRM WORLD.png','world-clear-bag',(0,0,703,898),[(49,19,316,57),(655,8,703,84)])
photo_clean('desktop_WRM WORLD.png','world-samples',(703,0,1400,898),[(0,8,42,83),(592,18,663,57)])
crop('desktop_WRM WORLD.png','world-dye',(0,898,703,1769))
crop('desktop_WRM WORLD.png','world-dyed-bag',(703,898,1400,1769))
crop('desktop_WRM WORLD.png','world-history',(40,1867,1320,2878))
crop('desktop_WRM WORLD.png','world-wire',(0,2940,1400,3805))
(OUT/'provenance.json').write_text(json.dumps(records,indent=2))
print('Generated',len(list(OUT.glob('*.webp'))),'desktop assets')
