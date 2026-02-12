module Hugolint
  class Utils
    def self.occurences(needle, haystack)
      return 0 if haystack.empty?
      haystack.split(needle).count - 1
    end

    def self.occurrences_in_files(needle, files)
      occurences = 0
      files.each do |file|
        next if file.directory?
        occurences += occurences(needle, file.data)
      end
      occurences
    end
  end
end