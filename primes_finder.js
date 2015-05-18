/////////////////////////
//       cdepman       //
//    primes finder    //
/////////////////////////

var primes = function(upperLimit){
  var candidates = range(upperLimit, 2);
  var primes = primeSieve(candidates);
  return clean(primes, null);
}

var range = function(stop, start, step){
  var start = start || 0;
  var step = step || 1;
  var rangeArray = [];
  for (var i = start; i <= stop; i+=step){
    rangeArray.push(i);
  }
  return rangeArray;
}

var primeSieve = function(numArray){
  var i = 0;
  while (i <= Math.sqrt(numArray.length)){
    numArray = knockOutMultiples(numArray, i);
    i = findNextLegalIndex(numArray, i);
  }
  return numArray;
}

var knockOutMultiples = function(array, index){
  var base = array[index];
  index += base;
  for (var i = index; i < array.length; i+=base){
    array[i] = null;
  }
  return array;
}

var findNextLegalIndex = function(array, currentIndex){
  while(array[++currentIndex] === null){}
  return currentIndex;
}

var clean = function(array, target){
  cleanedArray = [];
  for (var i = 0; i < array.length; i++){
    if (array[i] !== target){
      cleanedArray.push(array[i]);
    }
  }
  return cleanedArray;
}

// test:
console.log(primes(100000));