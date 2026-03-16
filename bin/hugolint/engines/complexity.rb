module Hugolint
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
        if clean?
          message = "### Complexity is perfect ✅\n"
        else
          message = "### Complexity (#{level})\n"
          message += "Cyclomatic complexity should not be too high.\n"
          message += "#{ @dangers } dangers, #{ @warnings } warnings\n"
          message += "| Id | State | Complexity | File |\n"
          message += "|---|---|---|---|\n"
          index = 1
          analyzed_files.each do |file|
            complexity = file.json[:complexity]
            next unless complexity[:problem]
            message += "| cpx-#{index} | #{complexity[:icon]} | #{complexity[:score]} | #{file.short_path} |\n"
            index += 1
          end
        end
        message
      end

      protected

      def should_analyze?(file)
        super &&
        !file.directory?
      end

      def sort!
        @analyzed_files.sort_by!{ |file| file.json[:complexity][:score] }.reverse!
      end

      def analyze(file)
        score = 1
        KEYWORDS.each do |keyword|
          score += Hugolint::Utils.occurences("#{keyword} ", file.data)
        end
        problem = score > WARNING
        icon = ICON_OK
        if score > DANGER
          icon = ICON_DANGER
          @dangers += 1
        elsif score > WARNING
          icon = ICON_WARNING
          @warnings += 1
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
