require_relative 'engines/base'
require_relative 'engines/complexity'
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
      message = ''
      message += engine_complexity.to_s
      message += engine_partial_calls.to_s
      message
    end

    def engine_complexity
      @engine_complexity ||= Engines::Complexity.new(self)
    end

    def engine_partial_calls
      @engine_partial_calls ||= Engines::PartialCalls.new(self)
    end

    def paths
      @paths ||= Dir.glob(LAYOUTS)
    end

    def files
      @files ||= paths.map { |path| HugoAnalyzer::File.new(path) }
    end
  end
end
