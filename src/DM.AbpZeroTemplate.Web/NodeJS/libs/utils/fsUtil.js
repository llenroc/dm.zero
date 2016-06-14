var fs = require('fs');
var path = require('path');
var asyncUtil = require('./asyncUtil');
var config = require('../../conf/config.json');
var fsUtil = {};

/* *
 * 读取文件
 * @filePath      读取文件路径
 * */
fsUtil.readFileSync = function (filePath) {
    return fs.readFileSync(filePath);
};

/* *
 * 读取文件(异步)
 * @filePath      读取文件路径
 * @callback      回调函数
 * */
fsUtil.readFile = function (filePath, callback) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            callback(err);
        }
        else {
            var bin = data;
            if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
                bin = bin.slice(3);
            }
            return callback(null, bin.toString('utf-8'));
        }
    });
};

/* *
 * 写入文件
 * @filePath      写入文件路径
 * @text          写入内容
 * */
fsUtil.writeFile = function (filePath, text) {
    fsUtil.mkDirIfNotExistsSync(filePath);
    fs.writeFileSync(filePath, text);
};

/* *
 * 写入文件(异步)
 * @filePath      写入文件路径
 * @text          写入内容
 * @callback      回调函数
 * */
fsUtil.writeFile = function (filePath, text, callback) {
    fsUtil.mkDirIfNotExists(filePath, function (err) {
        if (err) {
            callback && callback(err);
        }
        else {
            fs.writeFile(filePath, text, function (err, data) {
                if (err) {
                    callback && callback(err);
                }
                else {
                    callback && callback(null, data);
                }
            });
        }
    });
};


/* *
 * 判断文件夹是否存在
 * @pathName      文件夹路径
 * */
fsUtil.isExistsDirSync = function (pathName) {
    return fs.existsSync(path);
};

/* *
 * 判断文件夹是否存在(异步)
 * @pathName      文件路径
 * @callback      回调函数
 * */
fsUtil.isExistsDir = function (pathName, callback) {
    fs.exists(pathName, function (exists) {
        return callback(exists);
    });
};

/* *
 * 如果文件夹不存在，那么创建
 * @pathName      文件夹路径
 * */
fsUtil.mkDirIfNotExistsSync = function (pathName) {
    pathName = path.dirname(pathName);

    var pathNames = pathName.split(path.sep);
    var pathtmp;
    pathNames.forEach(function (dirname) {
        if (pathtmp) {
            pathtmp = path.join(pathtmp, dirname);
        }
        else {
            pathtmp = dirname;
        }
        if (!fsUtil.isExistsDirSync(pathtmp)) {
            if (!fs.mkdirSync(pathtmp)) {
                return false;
            }
        }
    });

    return true;

    // if (fsUtil.isExistsDirSync(pathName)) {
    //     if (exists) {
    //         return true;
    //     }
    //     else {
    //         fs.mkdirSync(pathName);
    //     }
    // }
}

/* *
 * 如果文件夹不存在，那么创建(异步)
 * @pathName      文件路径
 * @callback      回调函数
 * */
fsUtil.mkDirIfNotExists = function (dirpath, callback) {
    dirpath = path.dirname(dirpath);
    callback = callback ||
        function () { };

    fs.exists(dirpath,
        function (exitsmain) {
            if (!exitsmain) {
                //目录不存在
                var pathtmp;
                var pathlist = dirpath.split(path.sep);
                var pathlistlength = pathlist.length;
                var pathlistlengthseed = 0;

                mkdir_auto_next(pathlist, pathlist.length,
                    function (callresult) {
                        if (callresult) {
                            callback(null, true);
                        }
                        else {
                            callback(false);
                        }
                    });

            }
            else {
                callback(null, true);
            }

        });
    // fsUtil.isExistsDir(path.dirname(pathName), function (exists) {
    //     if (exists) {
    //         return callback && callback(null);
    //     }
    //     else {
    //         fs.mkdir(path.dirname(pathName), function (err) {
    //             callback && callback(err);
    //         });
    //     }
    // });
}

// 异步文件夹创建 递归方法
function mkdir_auto_next(pathlist, pathlistlength, callback, pathlistlengthseed, pathtmp) {
    callback = callback ||
        function () { };
    if (pathlistlength > 0) {

        if (!pathlistlengthseed) {
            pathlistlengthseed = 0;
        }

        if (pathlistlengthseed >= pathlistlength) {
            callback(true);
        }
        else {

            if (pathtmp) {
                pathtmp = path.join(pathtmp, pathlist[pathlistlengthseed]);
            }
            else {
                pathtmp = pathlist[pathlistlengthseed];
            }

            fs.exists(pathtmp,
                function (exists) {
                    if (!exists) {
                        fs.mkdir(pathtmp,
                            function (isok) {
                                if (!isok) {
                                    mkdir_auto_next(pathlist, pathlistlength,
                                        function (callresult) {
                                            callback(callresult);
                                        },
                                        pathlistlengthseed + 1, pathtmp);
                                }
                                else {
                                    callback(false);
                                }
                            });
                    }
                    else {
                        mkdir_auto_next(pathlist, pathlistlength,
                            function (callresult) {
                                callback(callresult);
                            },
                            pathlistlengthseed + 1, pathtmp);
                    }
                });

        }

    }
    else {
        callback(null, true);
    }

}

/* *
 * 从相对路径获取到绝对路径
 * @pathName      文件路径
 * */
fsUtil.mapPath = function (pathName) {
    if(!pathName)
        return '';
    return path.normalize(
        path.join(config.root,pathName)
        );

}

module.exports = fsUtil;