function defineReactive(obj, key, val){
  Object.defineProperty(obj, key, {
    get(){
      console.log(val)
      return val;
    },
    set(newVal){
      if(newVal != val){
        val = newVal;
      }
    }
  })
}
let obj = {};
defineReactive(obj, 'foo', 'foo');
obj.foo
obj.foo = 'fooooo';
obj.foo