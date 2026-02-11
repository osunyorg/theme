module HugoAnalyzer
  class File
    attr_reader :path, :json 

    def initialize(path)
      @path = path
      @json = {}
    end

    def data
      @data ||= ::File.read(path)
    end

    def directory?
      ::File.directory?(path)
    end

    def short_path
      @short_path ||= path.gsub('./layouts/', '')
    end
  end
end
