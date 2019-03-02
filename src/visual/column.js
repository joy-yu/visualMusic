import { Graphics } from 'pixi.js';
import { random } from '@/assets/util';

const baseGrap = new Graphics();

const gi = id => document.getElementById(id),
  box = gi('main');
let clientWidth = box.clientWidth;
let clientHeight = box.clientHeight;
const size = 54;
const offset = 4;
const renderSize = size - offset;

export default {
  name: 'column',
  init(containers) {
    this.resetTask();
    for (let i = 0; i < renderSize; i++) {
      const c_item = baseGrap.clone();
      c_item.position.set(4, clientHeight);
      containers.column.addChild(c_item);
    }
  },
  draw(arr, containers, sound) {
    if (sound && sound.instances[0]) {
      if (this.task.length && this.task[0].time < sound.instances[0]._elapsed) {
        //if(this.task[0].time - sound.instances[0]._elapsed > -10)
        //renderer.backgroundColor = this.task[0].backgroundColor
        this.task.shift();
      }
    }

    const w = clientWidth / renderSize; // 柱条宽度+黑边
    const ww = w * 0.6; // 柱条宽度
    const item = containers[this.name].children;

    for (let i = 0; i < renderSize; i++) {
      let h = ((arr[i] / 256) * clientHeight) / 1.5;
      h = h < 10 ? random(0, 10) : h;
      item[i].clear();
      item[i].lineStyle(ww, this.task.length ? this.task[0].lineColor : 0x66ccff, 1);
      item[i].moveTo(i * w, 0);
      item[i].lineTo(i * w, -h);
    }
  },
  resetTask() {
    this.task = [];
  },
  task: [],
};
