##########################
##       cdepman        ##
## first even occurence ##
##########################

# Time complexity: O(n^2)
def first_even_occurrence_readable(array)
  array.each{|item| return item if array.count(item) % 2 == 0}
  nil
end

# Time complexity: O(2n) => O(n)
def first_even_occurrence_efficient(array)
  hash = {};
  array.each do |item|
    hash[item] = !hash[item]
  end
  array.each do |item|
    return item if !hash[item]
  end
  nil
end

# test worst-case scenarios:
first_even_occurrence_efficient((2..10000).to_a.concat [1,1])
first_even_occurrence_readable((2..10000).to_a.concat [1,1])