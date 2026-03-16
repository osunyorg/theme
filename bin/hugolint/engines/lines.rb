module Hugolint
  module Engines
    class Lines < Base

      DANGER = 70
      WARNING = 35

      def to_s
        if clean?
          message = "### Lines are perfect ✅\n"
        else
          message = "### Too many lines (#{level})\n"
          message += "Files should not be too long, it's a sign of mess and a difficulty for overrides.\n"
          message += "#{ @dangers } ❌, #{ @warnings } ⚠️\n"
          message += "| Id | State | Lines | Path |\n"
          message += "|---|---|---|---|\n"
          index = 1
          analyzed_files.each do |file|
            lines = file.json[:lines]
            next unless lines[:problem]
            message += "| lin-#{index} | #{lines[:icon]} | #{lines[:count]} | #{file.short_path} |\n"
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

      def analyze(file)
        count = file.data.lines.count
        problem = count > WARNING
        icon = ICON_OK
        if count > DANGER
          icon = ICON_DANGER
          @dangers += 1
        elsif count > WARNING
          icon = ICON_WARNING
          @warnings += 1
        end
        file.json[:lines] = {
          count: count,
          icon: icon,
          problem: problem
        }
        file
      end

      def sort!
        @analyzed_files.sort_by! { |file| file.json[:lines][:count] }
                       .reverse!
      end
    end
  end
end
