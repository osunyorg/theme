module HugoAnalyzer
  module Engines
    class PartialCalls < Base

      ROOT = './layouts/partials/'

      def to_s
        message = "## Partials calls\n"
        message += "| Calls | Partial |\n"
        message += "|---|---|\n"
        analyzed_files.each do |file|
          calls = file.json[:calls]
          message += "| #{calls[:count]} | #{calls[:fragment]} |\n"
        end
        message
      end

      protected 

      def should_analyze?(file)
        !file.directory? &&
        file.path.include?(ROOT)
      end

      def analyze(file)
        fragment = file.path.gsub(ROOT, '').gsub('.html', '')
        call = "partial \"#{fragment}"
        count = HugoAnalyzer::Utils.occurrences_in_files(call, engine.files)
        file.json[:calls] = {
          fragment: fragment,
          count: count
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
