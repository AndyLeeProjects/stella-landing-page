"""Browser contracts for the desktop rebuild. Run against serve.py on 8768."""
import os,unittest
from playwright.sync_api import sync_playwright

class DesktopContract(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.p=sync_playwright().start()
  cls.browser=cls.p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
  cls.page=cls.browser.new_page(viewport={'width':1400,'height':900})
 @classmethod
 def tearDownClass(cls): cls.browser.close();cls.p.stop()
 def setUp(self):
  self.page.set_viewport_size({'width':1400,'height':900})
 def test_desktop_home_is_photographic_with_horizontal_navigation(self):
  p=self.page;p.goto(os.environ.get('WRM_TEST_URL','http://127.0.0.1:8768'))
  self.assertTrue(p.locator('#nav a',has_text='Shop').is_visible(),'Desktop needs the reference horizontal Shop link')
  self.assertFalse(p.locator('#menuBtn').is_visible(),'Hamburger belongs only on mobile')
  self.assertTrue(p.locator('h1',has_text='SALMON PURSE').is_visible())
  box=p.locator('#app img').first.bounding_box();self.assertIsNotNone(box)
  assert box is not None
  self.assertGreater(box['height'],1900)
  p.locator('#nav a',has_text='WRM World').click()
  self.assertTrue(p.url.endswith('/wrm-world'))
  p.set_viewport_size({'width':390,'height':844});p.goto(os.environ.get('WRM_TEST_URL','http://127.0.0.1:8768'))
  self.assertTrue(p.locator('#menuBtn').is_visible())
  self.assertTrue(p.locator('.mh2-purse').is_visible())

 def test_product_reference_has_full_vertical_photo_story(self):
  p=self.page;p.set_viewport_size({'width':1400,'height':900})
  p.goto('http://127.0.0.1:8768/product/salmon-purse')
  self.assertEqual(p.locator('.d-product-gallery img').count(),6)
  self.assertEqual(p.locator('h1').inner_text(),'Salmon Purse')
  p.locator('[data-add="salmon-purse"]').click()
  self.assertEqual(p.locator('#cart').get_attribute('aria-hidden'),'false')
  self.assertEqual(p.locator('#cartTotal').inner_text(),'$700')
  p.locator('[data-remove]').click();p.locator('#cartClose').click()
  p.goto('http://127.0.0.1:8768/product/salmon-bookmark')
  self.assertEqual(p.locator('.d-product-gallery img').count(),1)
  self.assertEqual(p.locator('h1').inner_text(),'Salmon Bookmark')

 def test_material_editorial_navigation(self):
  p=self.page;p.set_viewport_size({'width':1400,'height':900})
  p.goto('http://127.0.0.1:8768/about-materials')
  cards=p.locator('.d-material-card');self.assertEqual(cards.count(),2)
  left=cards.nth(0).bounding_box();right=cards.nth(1).bounding_box()
  assert left is not None and right is not None
  self.assertAlmostEqual(left['y'],right['y'],delta=1)
  cards.nth(0).click()
  self.assertIn('FROM INDUSTRY',p.locator('h1').inner_text())
  self.assertEqual(p.locator('.d-story-columns>div').count(),2)
  p.goto('http://127.0.0.1:8768/about-materials/algae')
  self.assertIn('REPLACEMENT',p.locator('h1').inner_text())
  self.assertEqual(p.locator('.d-story-figures figure').count(),2)

 def test_world_is_collage_linking_to_materials(self):
  p=self.page;p.set_viewport_size({'width':1400,'height':900})
  p.goto('http://127.0.0.1:8768/wrm-world')
  self.assertEqual(p.locator('.d-world img').count(),10)
  self.assertFalse(p.locator('#foot').is_visible())
  p.locator('a',has_text='Explore Materials').click()
  self.assertTrue(p.url.endswith('/about-materials'))
  self.assertTrue(p.locator('#foot').is_visible())

 def test_home_reference_section_boundaries(self):
  p=self.page;p.set_viewport_size({'width':1400,'height':900});p.goto('http://127.0.0.1:8768/')
  ocean=p.locator('.d-home-ocean').bounding_box();footer=p.locator('#foot').bounding_box()
  assert ocean is not None and footer is not None
  y=ocean['y']
  self.assertAlmostEqual(y,5032,delta=3)
  self.assertAlmostEqual(footer['y'],5922,delta=3)

 def test_breakpoint_transition_restores_mobile_and_desktop(self):
  p=self.page;p.goto('http://127.0.0.1:8768/wrm-world')
  self.assertFalse(p.locator('#foot').is_visible())
  p.set_viewport_size({'width':390,'height':844})
  p.wait_for_function("!document.querySelector('.d-world')")
  self.assertTrue(p.locator('#menuBtn').is_visible())
  self.assertTrue(p.locator('#foot').is_visible())
  p.locator('#menuBtn').click();self.assertEqual(p.locator('#menu').get_attribute('aria-hidden'),'false')
  p.keyboard.press('Escape');self.assertEqual(p.locator('#menu').get_attribute('aria-hidden'),'true')
  p.set_viewport_size({'width':1400,'height':900})
  p.wait_for_selector('.d-world')
  self.assertFalse(p.locator('#foot').is_visible())
  p.locator('#nav a',has_text='About Materials').click()
  self.assertTrue(p.locator('#foot').is_visible())
  p.go_back();p.wait_for_selector('.d-world')

 def test_cart_quantity_and_escape(self):
  p=self.page;p.goto('http://127.0.0.1:8768/product/salmon-bookmark')
  p.locator('[data-add]').click()
  self.assertEqual(p.locator('#cartTotal').inner_text(),'$32')
  p.locator('[data-qty][data-d="1"]').click()
  self.assertEqual(p.locator('#cartTotal').inner_text(),'$64')
  p.locator('[data-remove]').click();self.assertTrue(p.locator('.cart-empty').is_visible())
  p.keyboard.press('Escape');self.assertEqual(p.locator('#cart').get_attribute('aria-hidden'),'true')

 def test_footer_wordmark_retains_native_aspect_ratio(self):
  p=self.page;p.goto('http://127.0.0.1:8768/product/salmon-bookmark')
  p.locator('.foot-mark').evaluate('(i)=>i.decode()')
  r=p.locator('.foot-mark').evaluate('(i)=>({actual:i.clientWidth/i.clientHeight,native:i.naturalWidth/i.naturalHeight})')
  self.assertAlmostEqual(r['actual'],r['native'],delta=.08)

if __name__=='__main__':unittest.main()
