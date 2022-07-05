test = "eee";

function test2() {
  "use strict";
  console.log(">>>?", this);
  let test = 0;
  // this.test = "e";
  return "ee";
}

function test3() {
  console.log(">>>?", this);
  let test = 0;
  this.test = "e";
  return "ee";
}

console.log(test2());
console.log(test3());

console.log("///////////////////////////////");

// call 또는 apply의 첫 번째 인자로 객체가 전달될 수 있으며 this가 그 객체에 묶임
var obj = { a: "Custom" };

// 변수를 선언하고 변수에 프로퍼티로 전역으로 할당
var a = "Global";

function whatsThis() {
  return this.a; // 함수 호출 방식에 따라 값이 달라짐
}

console.log(whatsThis()); // this는 'undefined'. 함수 내에서 설정되지 않았으므로 global/window 객체로 초기값을 설정한다.
console.log(whatsThis.call(ee));
console.log(whatsThis.call(obj)); // this는 'Custom'. 함수 내에서 obj로 설정한다.
console.log(whatsThis.apply(obj)); // this는 'Custom'. 함수 내에서 obj로 설정한다.
