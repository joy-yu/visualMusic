import '@/index.less';
import * as PIXI from 'pixi.js';
import 'pixi-sound';
import visual from '@/visual';

// 歌曲列表
const m_list = ['Bohemian', 'need', 'push'];

const gi = id => document.getElementById(id),
  box = gi('main'),
  list = gi('list'),
  types = gi('type'),
  left = gi('left'),
  menuIcon = gi('menuIcon');

let clientWidth = box.clientWidth,
  clientHeight = box.clientHeight;
let type = ''; //当前可视化类型
let sound = null; //PIXI.sound
const size = 128; //音频数据数组长度
const offset = 8; //数据数组偏移

const Container = PIXI.Container,
  autoDetectRenderer = PIXI.autoDetectRenderer,
  // Rectangle = PIXI.Rectangle,
  loader = PIXI.loader,
  // resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;
// ParticleContainer = PIXI.particles.ParticleContainer,
// Graphics = PIXI.Graphics,
// Text = PIXI.Text,
// TextureCache = PIXI.utils.TextureCache;

const renderer = autoDetectRenderer(clientWidth, clientHeight, {
  antialias: true,
  transparent: false,
});
const stage = new Container();
const containers = {};

renderer.backgroundColor = 0x0f1619;
renderer.autoResize = true;
box.appendChild(renderer.view);

const loading = document.getElementById('loading');
const showLoading = (str = 'loading... please wait..') => {
  loading.style.display = 'block';
  loading.textContent = str;
};
const hideLoading = () => {
  loading.style.display = 'none';
};

function init() {
  clientWidth = box.clientWidth;
  clientHeight = box.clientHeight;
  renderer.resize(clientWidth, clientHeight);

  for (let i = 0, len = visual.length; i < len; i++) {
    containers[visual[i].name] && containers[visual[i].name].removeChildren();
    containers[visual[i].name] = new Container();

    visual[i].init(containers, stage);
    stage.addChild(containers[visual[i].name]);
  }
  renderer.render(stage);

  // stage.addChild(dungeon);

  loader.add('bg', './bh.jpg').load(e => {
    let bg = new Sprite(e.resources.bg.texture);
    bg.width = clientWidth;
    bg.height = clientHeight;
    stage.addChildAt(bg, 0);
  });
}

init();

function draw(arr) {
  arr = arr.slice(offset);

  for (let i = 0, len = visual.length; i < len; i++) {
    if (type === visual[i].name) {
      visual[i].draw(arr, containers, sound);
    }
  }
  renderer.render(stage);
}

function visualize() {
  const arr = new Uint8Array(size);
  const v = () => {
    sound && sound.context.analyser.getByteFrequencyData(arr);
    draw(arr);
    requestAnimationFrame(v);
  };
  v();
}
visualize();

function play(url) {
  showLoading();
  sound && sound.stop();
  sound = PIXI.sound.Sound.from({
    url: url,
    preload: true,
    loaded(err, sd) {
      hideLoading();
      for (let i = 0, len = visual.length; i < len; i++) {
        if (visual[i].name === type) {
          visual[i].resetTask();
          break;
        }
      }
      sd.play();
      console.log(sd);
    },
  });
}


// 切换歌
list.innerHTML = m_list.reduce((iter, v) => {
  return iter + `<li>${v}</li>`;
}, '');
list.addEventListener('click', e => {
  const liArr = [].slice.call(e.currentTarget.children);
  if (e.target.nodeName === 'LI') {
    liArr.forEach(v => {
      if (v.classList.contains('selected')) v.classList.remove('selected');
      if (e.target === v) {
        v.classList.add('selected');
        play(`/${v.textContent}.mp3`);
      }
    });
  }
});

// 切换视觉类型
types.innerHTML = visual.reduce((iter, v) => {
  return (
    iter + `<li data-type=${v.name} class="${v.name === type ? 'selected' : ''}">${v.name}</li>`
  );
}, '');
if (!type) {
  types.children[0].classList.add('selected');
  type = types.children[0].getAttribute('data-type');
}

types.addEventListener('click', e => {
  const liArr = [].slice.call(e.currentTarget.children);
  if (e.target.nodeName === 'LI') {
    liArr.forEach(v => {
      if (v.classList.contains('selected')) v.classList.remove('selected');
      if (e.target === v) {
        v.classList.add('selected');
        type = v.getAttribute('data-type');

        for (let i = 0, len = visual.length; i < len; i++) {
          if (type === visual[i].name) {
            containers[visual[i].name].visible = true;
          } else {
            containers[visual[i].name].visible = false;
          }
        }
      }
    });
  }
});

menuIcon.addEventListener('click', () => {
  left.classList.toggle('left-hide');
  menuIcon.classList.toggle('reverse');
});

/*
播放音乐API：

var ac = new window.AudioContext()
属性：
destination音频节点输出聚集地
currentTime创建开始到当前时间（s）

decodeAudioData(arrBuffer, succ(buffer), err)

var buffersource = ac.createBufferSource()
属性：
buffer，要播放的音频资源数据。--子属性：duration，表示时长。
loop，是否循环，默认false。
onended，音频播放完毕的回调。
方法：
start/noteOn(when,offset,duration)
end/noteOff(when,offset,duration)


var gainNode = createGain()/createGainNode(老)创建GainNode对象。音量相关。
gainNode.gain.value  0~1
*/

/*
分析API：
var analyser = createAnalyser()
fftSize，设置FFT，分析得到的频域。默认2048。实时得到的频域数据个数为fftSize一半。
frequencyBinCount，FFT值的一半。
getByteFrequencyData(Uint8Array)
*/
