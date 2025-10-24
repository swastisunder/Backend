function personMacker(name, age) {
  return {
    name: name,
    age: age,
    talk() {
      console.log(`Hi i am ${name}`);
    },
  };
}

const p1 = personMacker("ssb", 22);
const p2 = personMacker("om", 21);
