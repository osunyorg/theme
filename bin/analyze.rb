KEYWORDS = [
  'if',
  'else',
  'for',
  'range',
  'with',
].freeze

DANGER = 10
WARNING = 5

paths = Dir.glob('./layouts/**/*').reject { |path| File.directory?(path) }
files = []

def occurences(needle, haystack)
  return 0 if haystack.empty?
  haystack.split(needle).count - 1
end

def occurrences_in_files(needle, files)
  occurences = 0
  files.each do |file|
    occurences += occurences(needle, file[:data])
  end
  occurences
end

def compute_complexity(data)
  complexity = 1
  KEYWORDS.each do |keyword|
    complexity += occurences("#{keyword} ", data)
  end
  icon = '✅'
  if complexity > DANGER
    icon = '❌'
  elsif complexity > WARNING
    icon = '⚠️'
  end
  {
    score: complexity,
    icon: icon,
    problem: complexity > WARNING
  }
end

def count_calls(path, files)
  root = './layouts/partials/'
  if path.include?(root)
    fragment = path.gsub(root, '').gsub('.html', '')
    call = "partial \"#{fragment}"
    count = occurrences_in_files(call, files)
    {
      fragment: fragment,
      count: count
    }
  else
    nil
  end
end

# Load content
paths.each do |path|
  next if File.directory?(path)
  data = File.read(path)
  files << {
    path: path,
    short_path: path.gsub('./layouts/', ''),
    data: data
  }
end

# Analyze
files.each do |file|
  complexity = compute_complexity(file[:data])
  file[:complexity] = complexity
  file[:calls] = count_calls(file[:path], files)
end

puts "## Complexity"
puts "| State | Complexity | File |"
puts "|---|---|---|"
files.sort_by{ |hash| hash[:complexity][:score] }
     .reverse
     .each do |file|
  next unless file[:complexity][:problem]
  puts "| #{file[:complexity][:icon]} | #{file[:complexity][:score]} | #{file[:short_path]} |"
end

puts "## Partials calls"
puts "| Calls | Partial |"
puts "|---|---|"
files.reject { |hash| hash[:calls].nil? }
     .sort_by { |hash| hash[:calls][:count] }
     .reverse
     .each do |file|
  puts "| #{file[:calls][:count]} | #{file[:calls][:fragment]} |"
end
