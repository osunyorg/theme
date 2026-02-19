require_relative 'engines/base'
require_relative 'engines/complexity'
require_relative 'engines/directories'
require_relative 'engines/lines'
require_relative 'engines/calls'
require_relative 'file'
require_relative 'utils'
require 'yaml'

module Hugolint
  class Analyzer

    LAYOUTS = './layouts/**/*'
    CONFIG = '.hugolint'

    def self.run
      new.to_s
    end

    def to_s
      message = "## Hugo analyzer\n"
      message += Engines::Directories.new(self).to_s
      message += Engines::Calls.new(self).to_s
      message += Engines::Lines.new(self).to_s
      message += Engines::Complexity.new(self).to_s
      message
    end

    def paths
      @paths ||= Dir.glob(LAYOUTS)
    end

    def files
      @files ||= paths.map { |path| Hugolint::File.new(path) }
    end

    def config
      @config ||= YAML.load_file(CONFIG)
    end
  end
end
