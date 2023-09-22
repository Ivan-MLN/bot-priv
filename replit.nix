{ pkgs }: {
  deps = [              
    pkgs.nodejs-16_x
    pkgs.tesseract
    pkgs.python
    pkgs.nodePackages.typescript
    pkgs.libuuid
    pkgs.ffmpeg
    pkgs.yarn
    pkgs.imagemagick  
    pkgs.wget
    pkgs.sox-unstable
    pkgs.curl
    pkgs.zip
    pkgs.pm2
    pkgs.git
    pkgs.nodePackages.pm2
    pkgs.libsox-fmt-all
  ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [ pkgs.libuuid ];
  };
}
