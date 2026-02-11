module HugoAnalyzer
  module Engines
    class Directories < Base

      DANGER = 20
      WARNING = 10

      def to_s
        message = "### Directories \n"
        message += "Directories should not contain too many files, it's probably a sign of mess.\n"
        message += "| Id | State | Files | Directory |\n"
        message += "|---|---|---|---|\n"
        index = 1
        analyzed_files.each do |file|
          directory = file.json[:directory]
          next unless directory[:problem]
          message += "| dir-#{index} | #{directory[:icon]} | #{directory[:count]} | #{file.short_path} |\n"
          index += 1
        end
        message
      end

      protected 

      def should_analyze?(file)
        file.directory?
      end

      def analyze(file)
        count = Dir["#{file.path}/*"].length
        problem = count > WARNING
        icon = ICON_OK
        if count > DANGER
          icon = ICON_DANGER
        elsif count > WARNING
          icon = ICON_WARNING
        end
        file.json[:directory] = {
          count: count,
          icon: icon,
          problem: problem
        }
        file
      end

      def sort!
        @analyzed_files.sort_by! { |file| file.json[:directory][:count] }
                       .reverse!
      end
    end
  end
end
