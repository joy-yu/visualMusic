import { Graphics } from 'pixi.js';
import { random } from '@/assets/util';

const baseGrap = new Graphics();

const gi = id => document.getElementById(id),
  box = gi('main');
let clientWidth = box.clientWidth;
let clientHeight = box.clientHeight;
const renderSize = 80;

export default {
  name: 'circle',
  init(containers) {
    this.resetTask();
    containers[this.name].position.set(clientWidth / 2, clientHeight / 2);
    for (let i = 0; i < renderSize; i++) {
      const f_item = baseGrap.clone();
      f_item.rotation = ((180 / renderSize) * i * Math.PI) / 180;
      containers[this.name].addChild(f_item);
    }
  },
  draw(arr, containers, sound) {
    if (sound && sound.instances[0]) {
      this.judgeTime(sound);
    }

    // 柱
    const r = 120; // 圆半径
    const w = 4; // 柱宽
    const item = containers[this.name].children;

    const mh = 4;
    const mOffset = 30;

    for (let i = 0; i < renderSize; i++) {
      let h = arr[i];
      h = h < 5 ? random(0, 5) : Math.pow(h, 3) / 90000;

      let tr = r + h;

      item[i].clear();
      item[i].lineStyle(w, this.task.length ? this.task[0].lineColor : 0x6affff, 1);
      item[i].moveTo(0, r);
      item[i].lineTo(0, tr);
      item[i].moveTo(0, -r);
      item[i].lineTo(0, -tr);

      item[i].moveTo(0, tr + mOffset);
      item[i].lineTo(0, tr + mOffset + mh);
      item[i].moveTo(0, -tr - mOffset);
      item[i].lineTo(0, -tr - mOffset - mh);
    }

    // 线
    const lineR = r;
    const lineW = 5;
    const start = arr[0] < 10 ? random(5, 10) : Math.pow(arr[0], 3) / 90000;
    const offset = 60;

    const fir = item[0];
    fir.lineStyle(lineW, this.task.length ? this.task[1].lineColor : 0xea3e77, 1);
    fir.moveTo(0, start + r + offset);

    for (let i = 0; i < renderSize; i++) {
      let h = arr[i];
      h = h < 10 ? random(5, 10) : Math.pow(h, 3) / 90000;
      h += offset;
      let tr = lineR + h;

      fir.lineTo(
        -tr * Math.sin((i * Math.PI) / renderSize),
        tr * Math.cos((i * Math.PI) / renderSize)
      );
    }
    for (let i = 0; i < renderSize; i++) {
      let h = arr[i];
      h = h < 10 ? random(5, 10) : Math.pow(h, 3) / 90000;
      h += offset;
      let tr = lineR + h;

      fir.lineTo(
        tr * Math.sin((i * Math.PI) / renderSize),
        -tr * Math.cos((i * Math.PI) / renderSize)
      );
    }
    fir.lineTo(0, start + r + offset);
  },
  judgeTime(sound) {
    if (this.task.length && this.task[0].time < sound.instances[0]._elapsed) {
      this.task.shift();
      this.judgeTime(sound);
    }
  },
  resetTask() {
    this.task = [...Array(200).keys()].map((v, i) => ({
      time: 5 * (i + 1),
      lineColor: random(1024, 12777215),
    }));
  },
  task: [],
};
