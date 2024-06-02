function asyncWrap(fn){ // alternative of try and catch
    return function (req,res,next) {
        fn(req,res,next).catch(err=> next(err));
    }
}  

module.exports = asyncWrap;