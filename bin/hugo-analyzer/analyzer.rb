require_relative 'engines/base'
require_relative 'engines/complexity'
require_relative 'engines/directories'
require_relative 'engines/lines'
require_relative 'engines/partial_calls'
require_relative 'file'
require_relative 'utils'

module HugoAnalyzer
  class Analyzer

    LAYOUTS = './layouts/**/*'

    def self.run
      new.to_s
    end

    def to_s
      message = "## Hugo analyzer\n"
      message += Engines::Complexity.new(self).to_s
      message += Engines::PartialCalls.new(self).to_s
      message += Engines::Directories.new(self).to_s
      message += Engines::Lines.new(self).to_s
      message
    end

    def paths
      @paths ||= Dir.glob(LAYOUTS)
    end

    def files
      @files ||= paths.map { |path| HugoAnalyzer::File.new(path) }
    end
  end
end
