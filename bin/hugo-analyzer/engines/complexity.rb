module HugoAnalyzer
  module Engines
    class Complexity < Base

      KEYWORDS = [
        'if',
        'else',
        'for',
        'range',
        'with',
      ].freeze

      DANGER = 10
      WARNING = 5

      def to_s
        message = "## Complexity\n"
        message += "| Id | State | Complexity | File |\n"
        message += "|---|---|---|---|\n"
        index = 1
        analyzed_files.each do |file|
          complexity = file.json[:complexity]
          next unless complexity[:problem]
          message += "| cpl-#{index} | #{complexity[:icon]} | #{complexity[:score]} | #{file.short_path} |\n"
          index += 1
        end
        message
      end

      protected

      def should_analyze?(file)
        !file.directory?
      end

      def sort!
        @analyzed_files.sort_by!{ |file| file.json[:complexity][:score] }.reverse!
      end

      def analyze(file)
        score = 1
        KEYWORDS.each do |keyword|
          score += HugoAnalyzer::Utils.occurences("#{keyword} ", file.data)
        end
        problem = score > WARNING
        icon = ICON_OK
        if score > DANGER
          icon = ICON_DANGER
        elsif score > WARNING
          icon = ICON_WARNING
        end
        file.json[:complexity] = {
          score: score,
          icon: icon,
          problem: problem
        }
        file
      end
    end
  end
end
