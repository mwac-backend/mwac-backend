module.exports.pathMapping = ({shortPath, hostname}) => {
    if (shortPath  == undefined || shortPath == null) return undefined;
    if (!(shortPath || "").includes("http")) {
      var path = `${process.env.BASE_URL_PATH}/file_resource${shortPath}`;
      return path;
    }
    return shortPath;
  };