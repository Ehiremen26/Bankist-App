'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    math.round(math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const now = new Date();
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formatteMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatteMov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatcur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatcur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatcur(math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatcur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(math.trunc(time / 60)).padStart(2, 0);
    const sec = time % 60;
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log ooy user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
    }
    containerApp.style.opacity = 0;
    // Decrease 1 second
    time--;
  };
  // Set time to 5 minutes
  let time = 100;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting API

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new date().toISOString());
    receiverAcc.movementsDates.push(new date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.acc, !sorted);
  sorted = !sorted;
});

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// // const currencies = new Map([
// //   ['USD', 'United States dollar'],
// //   ['EUR', 'Euro'],
// //   ['GBP', 'Pound sterling'],
// // ]);

// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

// // let arr = ['a', 'b', 'c', 'd', 'e'];

// // // SLICE
// // console.log(arr.slice(2));
// // console.log(arr.slice(2, 4));
// // console.log(arr.slice(-2));
// // console.log(arr.slice(-1));
// // console.log(arr.slice(1, -2));
// // console.log(arr.slice());
// // console.log([...arr]);

// // // SPLICE (mutate an array)
// // console.log(arr.splice(2));
// // arr.splice(-1);
// // console.log(arr);
// // arr.splice(1, 2);
// // console.log(arr);

// // // REVERSE
// // arr = ['a', 'b', 'c', 'd', 'e'];
// // const arr2 = ['j', 'i', 'h', 'g', 'f'];
// // console.log(arr2.reverse());
// // console.log(arr2);

// // // CONCAT
// // const letters = arr.concat(arr2);
// // console.log(letters);
// // console.log([...arr, ...arr2]);

// // // JOIN
// // console.log(letters.join('-'));

// // THE NEW AT METHOD
// // const arr = [23, 11, 64];
// // console.log(arr[0]);
// // console.log(arr.at(0));

// // getting last array element
// // console.log(arr[arr.length - 1]);
// // console.log(arr.slice(-1)[0]);
// // console.log(arr.at(-1));

// // console.log('jonas'.at(0));
// // console.log('jonas'.at(-1));

// // Looping Arrays: FOREACH
// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const [i, movement] of movements.entries()) {
// //   if (movement > 0) {
// //     console.log(`Movement ${i + 1}: You deposited ${movement}`);
// //   } else {
// //     console.log(`Movement ${i + 1}: You withdrew ${math.abs(movement)}`);
// //   }
// // }

// // console.log('-------- FOREACH -------');
// // movements.forEach()(function ([mov, i, arr]) {
// //   if (mov > 0) {
// //     console.log(`Movement ${i + 1}: You deposited ${movement}`);
// //   } else {
// //     console.log(`Movement ${i + 1}: You withdrew ${math.abs(movement)}`);
// //   }
// // });

// // ForEach with maps and sets
// // const currencies = new Map([
// //   ['USD', 'United States dollar'],
// //   ['EUR', 'Euro'],
// //   ['GBP', 'Pound sterling'],
// // ]);

// // // MaP
// // currencies.forEach(function (value, key, map) {
// //   console.log(`${key}: ${value}`);
// // });

// // // Set
// // const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// // console.log(currenciesUnique);
// // currenciesUnique.forEach(function (value, _, map) {
// //   console.log(`${value}: ${value}`);
// // });

// // Challenge 1.

// // const checkDogs = function (dogsJulia, dogsKate) {
// //   const dogsJuliaCorrected = dogsJulia.slice();
// //   dogsJuliaCorrected.splice(0, 1);
// //   dogsJuliaCorrected.splice(-2);
// //   const dogs = dogsJuliaCorrected.concat(dogsKate);

// //   dogs.forEach(function (dog, i) {
// //     if (dog >= 3) {
// //       console.log(`Dog number ${i + 1} is and adult, and is ${dog} years old`);
// //     } else {
// //       console.log(`Dog number ${i + 1} is still a puppy`);
// //     }
// //   });
// // };

// // checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3])
// // checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4])

// // The Map Method
// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // const eurToUsd = 1.1;

// // const movementsUSD = movements.map(function (mov) {
// //   return mov * eurToUsd;
// // });
// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map((mov, i) => {
//   `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//     mov
//   )}}`;
// });

// console.log(movementsDescriptions);

// // The Filter Method
// // const deposits = movements.filter(function (mov) {
// //   return mov > 0;
// // });
// // console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// // const withdrawals = movements.filter(mov => mov < 0);
// // console.log(withdrawals);

// // The Reduce Method
// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   return acc + cur;
// // }, 0);
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// // Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// // Challenge 2
// // const calcAverageHumanAge = function (ages) {
// //   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
// //   const adults = humanAges.filter(age => age >= 18);

// //   const average = adults.reduce(
// //     (acc, age, i, arr) => acc + age / arr.length,
// //     0
// //   );
// //   return average;
// // };

// // const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// // const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// // console.log(avg1, avg2);

// // The Magic of chaining methods
// // PIPELINE

// // const eurToUsd = 1.1;

// // const totalDepositsUSD = movements
// //   .filter(mov => mov > 0)
// //   .map((mov, i, arr) => {
// //     console.log(arr);
// //     return mov * eurToUsd;
// //   })
// //   .reduce((acc, mov) => acc + mov, 0);
// // console.log(totalDepositsUSD);

// // Challenge 3.
// // const calcAverageHumanAge = ages =>
// //   ages
// //     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
// //     .filter(age => age >= 18)
// //     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// // const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// // const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// // console.log(avg1, avg2);

// // The Find Method
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davies');
// console.log(account);

// for (const acc of accounts) acc.owner === 'Jessica Davies';
// console.log(acc);

// // Some and Every

// // specify a CONDITION (SOME)

// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every(mov => mov > 0));

// // separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));

// // Flat and FlatMAP

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// // const accountMovements = accounts.map(acc => acc.movements);
// // console.log(accountMovements);
// // const allMovements = accountMovements.flat();
// // console.log(allMovements);
// // const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// // console.log(overalBalance);

// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((ac, mov) => acc + mov, 0);
// console.log(overalBalance);

// // FlatMap
// const overalBalance2 = accounts
//   .flatmap(acc => acc.movements)
//   .reduce((ac, mov) => acc + mov, 0);
// console.log(overalBalance);

// // SORTING ARRAYS

// // with strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());

// // Numbers
// console.log(movements);

// // return < 0, A, B (keep order)
// // return > 0 B, A (switch order)

// // Ascending
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a > b) return -1;
// // });
// // console.log(movements);

// // movements.sort((a, b) => a - b);
// // console.log(movements);
// // movements.sort((a, b) => b - a);
// // console.log(movements);

// const x = new Array(7);
// console.log(x);

// // x.fill(1);
// x.fill(1, 3, 5);
// console.log(x);

// // array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const k = array.from({ length: 100 }, (_, i) => math.random(i) + 1);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('*', ''))
//   );
//   console.log(movementsUI);

//   movementsUI2 = [...document.querySelectorAll('.movements__value')];
// });

// // Array Methods Practice

// const bankDepositsSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositsSum);

// // 2.
// const numDeposist1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(numDeposist1000);

// // prefixed ++ operator
// let a = 10;
// console.log(++a);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// // 4.
// // this is a nice title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));
// console.log(convertTitleCase('this is a nice title'));

// // Challenge #4
// const dogs = [
//   {
//     weight: 22,
//     curFood: 250,
//     owners: ['Alice', 'Bob'],
//   },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // 1.
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);

// // 2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
// console.log(
//   `Sarah's dog is eating ${
//     dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
//   }`
// );

// // 3.
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooLittle);

// // 4.
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat to little!`);

// // 5.
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// // 6.

// const checkEatingOkay = dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

// console.log(dogs.some(checkEatingOkay));

// // 7.
// console.log(dogs.filter(checkEatingOkay));

// // 8.
// const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recfood);
// console.log(dogsSorted);
// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// // CONVERTING AND CHECKING NUMBERS

// // PARSING
// console.log(Number.parseInt('30px', 10));

// console.log(Number.parseFloat(' 2.5rem '));

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));

// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(20 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));

// // MATH AND ROUNDING
// console.log(math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(math.max(5, 18, 23, 11, 2));
// console.log(math.min(5, 18, 23, 11, 2));

// console.log(math.pi * Number.parseFloat('18px') ** 2);

// console.log(math.trunc(math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   math.floor(math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// // rounding integers
// console.log(math.round(23.3));
// console.log(math.round(23.9));
// console.log(math.ceil(23.3));
// console.log(math.ceil(23.9));

// console.log(math.floor(23.3));
// console.log(math.floor('23.9'));

// // rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log(+(2.345).toFixed(2));

// // Reminder Operator
// console.log(5 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangeRed';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// // Numeric Separators
// const diameter = 287_460_000_000;
// console.log(diameter);

// const priceCents = 345_99;
// console.log(priceCents);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.1415;

// // Working with BigInt
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(BigInt(45467896543423534676768));

// // Operations
// console.log(10000n + 1000n);

// // Divisions
// console.log(10n / 3n);

// // Creating Dates

// // 1. create a date
// // const now = new Date();
// // console.log(now);

// // 1. parse from date string
// console.log(new Date('Aug 02 2020 18:05:41'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// // working with dates
// // const future = new Date(2037, 10, 19, 15, 23, 5);
// // console.log(future);
// // console.log(future.getFullYear());
// // console.log(future.getMonth());
// // console.log(future.getDate());
// // console.log(future.getDay());
// // console.log(future.getHours());
// // console.log(future.getMinutes());
// // console.log(future.getSeconds());
// // console.log(future.toISOString());
// // console.log(future.getTime());

// // console.log(new Date(2142256980000));

// // console.log(date.now());

// // future.setFullYear(2040);
// // console.log(future);

// // Operations wiith dates
// // const future = new Date(2037, 10, 19, 15, 23, 5);
// // console.log(+future);

// // const calcDaysPassed = (date1, date2) =>
// //   math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// // calcDaysPassed(new date(2037, 3, 4), new date(2037, 3, 14));
// // console.log(days1);

// // const num = 3884764.23;

// // console.log('US:', new Intl.NumberFormat('en-US').format(num));
// // console.log('Germany:', new Intl.NumberFormat('de-DE').format(num));
// // console.log('Syria:', new Intl.NumberFormat('ar-SY').format(num));

// setTimeout(() => console.log('Here is your Pizza'), 3000);

// setInterval(function () {
//   const now = new date();
//   console.log(now.gethour().getMinutes().getseconds());
// }, 1000);

// // Implemneting a countdown timer
