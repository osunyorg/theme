module HugoAnalyzer
  module Engines
    class Base
      attr_reader :engine

      def initialize(engine)
        @engine = engine
      end

      def analyzed_files
        unless @analyzed_files
          @analyzed_files = []
          engine.files.each do |file|
            next unless should_analyze?(file)
            @analyzed_files << analyze(file)
          end
          sort!
        end
        @analyzed_files
      end

      def to_s
      end

      protected

      def should_analyze?(file)
        true
      end

      def analyze(file)
      end

      def sort!
      end
    end
  end
end
