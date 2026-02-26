module Hugolint
  module Engines
    class Base
      attr_reader :analyzer

      ICON_DANGER = '❌'
      ICON_WARNING = '⚠️'
      ICON_OK = '✅'

      def initialize(analyzer)
        @analyzer = analyzer
      end

      def analyzed_files
        unless @analyzed_files
          @analyzed_files = []
          analyzer.files.each do |file|
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
        !files_excluded.include?(file.short_path)
      end

      def analyze(file)
      end

      def sort!
      end

      def engine_identifier
        self.class.name.split('::').last.downcase
      end

      def engine_config
        @engine_config ||= analyzer.config.dig('engines', engine_identifier)
      end

      def files_excluded
        @files_excluded ||= engine_config&.dig('exclude') || []
      end
    end
  end
end
