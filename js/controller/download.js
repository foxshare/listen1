document.getElementById("downloadMusic").addEventListener("click", downloadMusic);
function downloadMusic(){
    notyf.success("开始下载");
    function download(url, title) {
      axios.get(url, { responseType: "blob" })
        .then(resp => {
          if (resp.status !== 200) console.log('get file failed.');
          else return resp.data;
        })
        // 用blob方式来设置下载文件名为歌曲名
        .then(blob => {
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = title;
          link.click();
          window.URL.revokeObjectURL(link.href);
        })
    }
    //  设置文件名：歌曲名_歌手.mp3
    function get_name(idx) {
      let obj = threadPlayer.playlist.filter(obj => obj.id == idx)[0]
      return obj.title + '_' + obj.artist + '.mp3';
    }

    // 修改原播放器获取歌曲链接函数，增加获取链接时下载歌曲
    threadPlayer.setMediaURI = function setMediaURI(uri, url) {
      if (url) {
        this._media_uri_list[url] = uri;
        //  插入下载函数
        download(uri, get_name(url));
      }
    }
    // 循环播放列表所有歌，获得每首歌的地址同时触发下载
    for (let i = 0; i < threadPlayer.playlist.length; i++) {
      threadPlayer.retrieveMediaUrl(i, false)
    }
}