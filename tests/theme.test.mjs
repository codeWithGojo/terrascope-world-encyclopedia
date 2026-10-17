import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {themeBootScript,isThemePreference,resolveTheme} from '../app/theme.ts';
function boot(saved,systemDark=false,blocked=false){const root={dataset:{},style:{}};vm.runInNewContext(themeBootScript,{localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;}},window:{matchMedia:q=>({matches:q.includes('color-scheme')?systemDark:false})},document:{documentElement:root}});return root;}
test('theme is resolved in the head before paint, including system and blocked storage',()=>{assert.equal(boot('dark').dataset.theme,'dark');assert.equal(boot('light',true).dataset.theme,'light');assert.equal(boot('system',true).dataset.theme,'dark');assert.equal(boot('bad',false).dataset.theme,'light');assert.equal(boot(null,true,true).style.colorScheme,'dark');assert.equal(boot('dark').dataset.motion,'on');});
test('theme choices are bounded and explicit choices override the operating system',()=>{assert.equal(isThemePreference('dark'),true);assert.equal(isThemePreference('sepia'),false);assert.equal(resolveTheme('light',true),'light');assert.equal(resolveTheme('system',true),'dark');});
