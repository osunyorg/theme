module Hugolint
  module Engines
    class PartialCalls < Base

      ROOT = './layouts/partials/'

      def to_s
        message = "### Partials calls\n"
        message += "Partials called once might be in the wrong place. Partials never called might be metaprogrammed, or obsolete.\n"
        message += "| Id | State | Calls | Partial |\n"
        message += "|---|---|---|---|\n"
        index = 1
        analyzed_files.each do |file|
          calls = file.json[:calls]
          next unless calls[:problem]
          message += "| cal-#{index} | #{calls[:icon]} | #{calls[:count]} | #{calls[:fragment]} |\n"
          index += 1
        end
        message
      end

      protected 

      def should_analyze?(file)
        super &&
        !file.directory? &&
        file.path.include?(ROOT)
      end

      def analyze(file)
        fragment = file.path.gsub(ROOT, '').gsub('.html', '')
        call = "partial \"#{fragment}"
        count = Hugolint::Utils.occurrences_in_files(call, analyzer.files)
        if count == 0
          problem = true
          icon = ICON_DANGER
        elsif count == 1
          problem = true
          icon = ICON_WARNING
        else
          problem = false
          icon = ICON_OK
        end
        file.json[:calls] = {
          fragment: fragment,
          count: count,
          problem: problem,
          icon: icon
        }
        file
      end

      def sort!
        @analyzed_files.sort_by! { |file| file.json[:calls][:count] }
                       .reverse!
      end
    end
  end
end
