KEYWORDS = [
  'if',
  'else',
  'for',
  'range',
  'with',
].freeze

DANGER = 10
WARNING = 5

files = []

def occurences(needle, haystack)
  return 0 if haystack.empty?
  haystack.split(needle).count - 1
end

def compute_complexity(data)
  complexity = 1
  KEYWORDS.each do |keyword|
    complexity += occurences("#{keyword} ", data)
  end
  complexity
end

Dir.glob('./layouts/**/*').each do |path|
  next if File.directory?(path)
  data = File.read(path)
  complexity = compute_complexity(data)
  files << {
    path: path,
    complexity: complexity
  }
end

files.sort_by! { |hash| hash[:complexity] }.reverse!

puts "| State | Complexity | File |"
puts "|---|---|---|"
files.each do |hash|
  next if hash[:complexity] < WARNING
  icon = hash[:complexity] > DANGER ? '❌' : '⚠️'
  path = hash[:path].gsub('./layouts/', '')
  complexity = hash[:complexity]
  puts "| #{icon} | #{complexity} | #{path} |"
end