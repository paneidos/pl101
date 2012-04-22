// this is all you

var endTime=function(time, expr) {
    if(expr.tag == 'note')
    {
        return time + expr.dur;
    }
    else if(expr.tag == 'seq')
    {
        return endTime(endTime(time, expr.left), expr.right);
    }
    else if(expr.tag == 'par')
    {
        return Math.max(endTime(time, expr.left), endTime(time, expr.right));
    }
};

var compilePitch = function(pitch) {
    var pitches = {
        'c': 0,
        'c#': 1,
        'd': 2,
        'd#': 3
        'e': 4,
        'f': 5,
        'f#': 6
        'g': 7,
        'g#': 8,
        'a': 9,
        'a#', 10,
        'b': 11,
    };
    var match;
    if(match = pitch.match(/([a-g]#?)([0-9])/))
    {
        return pitches[match[0]] + 12 * (match[1]+1);
    }
}

var compileT = function(time, musexpr) {
    var left,right;
    if(musexpr.tag == 'note')
    {
        return [{
            tag: 'note',
            pitch: compilePitch(musexpr.pitch),
            start: time,
            dur: musexpr.dur
            }];
    }
    else if(musexpr.tag == 'seq')
    {
        left = compileT(time, musexpr.left);
        right = compileT(endTime(time,musexpr.left), musexpr.right);
        return left.concat(right);
    }
    else if(musexpr.tag == 'repeat')
    {
        var result = [];
        for(var i=0;i<musexpr.count;i++)
        {
            // FIXME: speed it up by copying the nodes, instead of recompiling.
            result.concat(compileT(time, musexpr.section));
            time = endTime(time, musexpr.section);
        }
    }
    else if(musexpr.tag == 'pause')
    {        
        return [{
            tag: 'pause',
            start: time,
            dur: musexpr.dur
            }];
    }
    else if(musexpr.tag == 'par')
    {
        left = compileT(time, musexpr.left);
        right = compileT(time, musexpr.right);
        return left.concat(right);
    }
};

var compile = function (musexpr) {
    return compileT(0,musexpr);
};

