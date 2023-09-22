{ pkgs }: {
  deps = [              
    pkgs.nodejs
    pkgs.tesseract
    pkgs.python
    pkgs.nodePackages.typescript
    pkgs.libuuid
    pkgs.ffmpeg
    pkgs.yarn
    pkgs.imagemagick  
    pkgs.wget
    pkgs.sox
    pkgs.curl
    pkgs.zip
    pkgs.pm2
    pkgs.git
    pkgs.nodePackages.pm2
  ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [ pkgs.libuuid ];
  };
}