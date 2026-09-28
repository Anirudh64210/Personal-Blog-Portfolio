/*!
 * Pixel Anirudh v1.3
 * Full-body pixel companion. Pure JS, no dependencies, works in the browser and in Node.
 *
 * Grid: 50 x 64 art pixels, animated at 8 fps (one tick = 125 ms).
 * States: idle, sleep, awake, hello, work, eat, ask, reach,
 *         plus the timeline poses plant, lift, lab, celebrate, read.
 * `t` is the number of ticks since the state started.
 *
 *   PixelAnirudh.paint(canvas, 'work', t)          // 1 canvas px per art px
 *   PixelAnirudh.draw(ctx, 'hello', t, 4)          // any context, integer scale
 *   PixelAnirudh.build('eat', t).c                 // raw grid of palette keys (tests, exports)
 */
var PixelAnirudh = (function(){
  var W = 50, H = 64, OX = 7, OY = 6;

  var PAL = {
    o:'#1E1B2B', A:'#282433', B:'#31313E', C:'#3F4551', H:'#697479',          // hair
    s:'#DEA87D', d:'#C2775F', D:'#93504E', E:'#EFC7A2',                      // skin
    w:'#F3EFE7', g:'#66646B',                                                // eyes
    j:'#7E4D35', k:'#643B28', J:'#9A6242', K:'#4C2D1F',                      // suede jacket
    c:'#EFE8DE', q:'#D5CAB9',                                                // sherpa
    t:'#1E1E27',                                                             // black tee
    p:'#E7DDC9', P:'#D0C3AA', Q:'#B6A88E',                                   // cream cargos
    x:'#26262E', X:'#17171C', z:'#3E3E4A', W:'#34343E',                      // black knit runners
    L:'#B8BFC7', M:'#8C939C', N:'#D6DBE0', Y:'#E6A93A',                      // laptop
    T:'#5E646E',                                                             // keyboard
    G:'#F2C14E', r:'#C8463C', b:'#C98A3E', u:'#5A3526',                      // pizza, coffee
    F:'#B58D62', f:'#96714B', e:'#76573B',                                   // wood
    Z:'#3A3D48',                                                             // chair
    U:'#5B7BA6', I:'#4A6890',                                                // blanket
    n:'#F6F1E7', V:'#BDB2A0', R:'#C8463C',                                   // envelope
    O:'#E6A93A',                                                             // ! and ?
    // timeline poses (plant, lift, lab, celebrate, read)
    pr:'#C0683F', pb:'#A4552F', ps:'#7E3F22', pd:'#3B2A20',                  // terracotta pot, soil
    sl:'#86C06A', sm:'#5E9E4A', sd:'#3F7A36',                                // sprout
    a1:'#F1EFE9', a2:'#CFCBC2', a3:'#B3AEA5', a4:'#FFFFFF', a5:'#E2DED6', a6:'#C4BFB5', // lab coat
    ib:'#4F74B3', ip:'#3E62A8',                                              // ID badge stripe, pen
    t1:'#3A5A91', t2:'#2F4A7A', t3:'#6E91CC',                                // athletic top (with ib)
    h1:'#2E2E38', h2:'#24242C',                                              // shorts
    k1:'#F6F1E7', k2:'#D5CAB9', k3:'#E0607E', k4:'#B8B4AC',                  // sneakers
    b1:'#A9A9B3', b2:'#7C7C88', b3:'#55555F', b4:'#3A3A44',                  // barbell and plates
    sw:'#9CC3E0',                                                            // sweat drop
    bk:'#F2B33D',                                                            // book title stripe, confetti
    l1:'#8E9DA9', l2:'#6B798A', l3:'#667585', l4:'#C0A7A2',                  // safety glasses: what shows through the
    l5:'#DBE9ED', l6:'#D9D3C7', l7:'#D0C2B3', l8:'#708190'                   // lenses (45% toward #BFE3F5)
  };

  var BASE = [
    "...............BB...............",
    "............BBBBBBBB...B........",
    ".........CCBBBBBBBBBBBBB........",
    ".........HHCBCCBBBBBBBBH........",
    ".......CCCCCCCCBBBBBBBBBBBC.....",
    ".......CCCCCBCBBBBoBBBBBBB......",
    "......CCCCBBBBoBBBoBBBBBBB......",
    "......CCCBBBBooBBBooBBBBBAC.....",
    "....CCCCBBBBoooBBoooBBBoBoA.....",
    "......BBBBBooDoBoodoBBBoBoA.....",
    "......BBoBBoAsABoDsdoBBoooA.....",
    "......oBoBoooodoodooooBoooA.....",
    ".....CoooooddddodsddddoooooH....",
    ".....AoDDodgAodAssgAodDoDooA....",
    ".......DdodwogEssswoodDDDo......",
    ".......sdodwBwEssswBwsDdDo......",
    ".......AdosssssEssssssddo.......",
    "........oodsssssssssssDoo.......",
    ".........oossssDDDsssDoo........",
    "..........oossssssssdoo.........",
    "..............dddd..............",
    "..........ccccttttcccc..........",
    "........jjccccttttccccjj........",
    ".......jjjcccqttttqcccjjj.......",
    "......jjjjjccqttttqccjjjjj......",
    "......kjjKjjjcttttcjjjKjjk......",
    "......kJjKjJjcttttcjjjKjjk......",
    "......kJjKjJjcttttcjjjKjjk......",
    "......kJjKjJjcttttcjjjKjjk......",
    "......kJjKjJjcttttcjjjKjjk......",
    "......kJjKjjjcttttcjjjKjjk......",
    "......kjjKjjjcttttcjjjKjjk......",
    "......kjjKkkkcttttckkkKjjk......",
    "......kjjKjjjcttttcjjjKjjk......",
    "......kjjKjjjcttttcjjjKjjk......",
    "......kjjKjjjcttttcjjjKjjk......",
    "......kkk.kkkkttttkkkk.kkk......",
    "......sss.PPPPPPPPPPPP.sss......",
    "......ddd.pppppppppppp.ddd......",
    "..........pppppppppppp..........",
    "..........ppppPppPpppp..........",
    "..........ppppp..ppppp..........",
    "..........QppPp..pPppQ..........",
    "..........QpppP..PpppQ..........",
    "..........QpppP..PpppQ..........",
    "..........QppPp..pPppQ..........",
    "..........ppppp..ppppp..........",
    "..........ppppp..ppppp..........",
    "..........ppppp..ppppp..........",
    "..........ppppp..ppppp..........",
    "..........ppppp..ppppp..........",
    "..........PPPPP..PPPPP..........",
    ".........xxxxxx..xxxxxx.........",
    ".........xXzxxX..XxxzXx.........",
    "........WWWWWWW..WWWWWWW........"
  ];
  var HEAD_ROWS = 20, TORSO_END = 40;

  function Grid(){ this.c=[]; for(var y=0;y<H;y++){ var r=[]; for(var x=0;x<W;x++) r.push(null); this.c.push(r); } }
  Grid.prototype.set=function(x,y,ch){ if(x>=0&&y>=0&&x<W&&y<H) this.c[y][x]=ch; };
  Grid.prototype.get=function(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?this.c[y][x]:null; };
  Grid.prototype.outline=function(){ var a=[],x,y; for(y=0;y<H;y++)for(x=0;x<W;x++){ if(this.c[y][x])continue;
    var self=this, solid=function(u,v){ var c=self.get(u,v); return c && c!=='o'; };   // outline pixels never spawn more outline
    if(solid(x,y-1)||solid(x,y+1)||solid(x-1,y)||solid(x+1,y)) a.push([x,y]); }
    for(var i=0;i<a.length;i++) this.c[a[i][1]][a[i][0]]='o'; };

  // painter in character coordinates. '.' = skip, '_' = erase
  function pen(g, dx, dy){
    return {
      g:g, dx:dx, dy:dy,
      s:function(x,y,str){ for(var i=0;i<str.length;i++){ var ch=str[i]; if(ch==='.') continue; g.set(OX+dx+x+i, OY+dy+y, ch==='_'?null:ch); } },
      block:function(x,y,rows){ for(var j=0;j<rows.length;j++) this.s(x,y+j,rows[j]); },
      rect:function(x,y,w,h,ch){ for(var j=0;j<h;j++) for(var i=0;i<w;i++) g.set(OX+dx+x+i, OY+dy+y+j, ch); },
      get:function(x,y){ return g.get(OX+dx+x, OY+dy+y); }
    };
  }

  // ---------- body parts from the base map ----------
  function drawHead(p){ for (var y=0;y<HEAD_ROWS;y++) p.s(0,y,BASE[y]); }
  function drawTorso(p){ for (var y=HEAD_ROWS;y<TORSO_END;y++) p.s(0,y,BASE[y]); }
  function drawLegs(p){ for (var y=TORSO_END;y<BASE.length;y++) p.s(0,y,BASE[y]); }
  function dropArm(p, side, fill){                     // remove the hanging arm so a posed one can be drawn
    var x0 = side==='R' ? 23 : 6, seam = side==='R' ? 22 : 9;
    for (var y=25;y<=38;y++){ p.s(x0,y,fill?fill+fill+fill:'___'); if(y<=35) p.s(seam,y,'j'); }
    p.s(side==='R'?25:6,24,'_');
  }

  // sleeve along a polyline, 3 px thick, with its own seam line and a darker cuff
  function limb(p, pts){
    var mask={}, order=[];
    function stamp(x,y){ for(var j=-1;j<=1;j++) for(var i=-1;i<=1;i++){ var k=(x+i)+','+(y+j); if(!mask[k]){ mask[k]=1; order.push([x+i,y+j]); } } }
    for (var s=0;s<pts.length-1;s++){
      var a=pts[s], b=pts[s+1], n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))||1;
      for (var i=0;i<=n;i++) stamp(Math.round(a[0]+(b[0]-a[0])*i/n), Math.round(a[1]+(b[1]-a[1])*i/n));
    }
    var under={}; order.forEach(function(q){ under[q[0]+','+q[1]]=p.get(q[0],q[1]); });
    order.forEach(function(q){ p.s(q[0],q[1],'j'); });
    // seam where the sleeve crosses the body, shade on the lower edge
    order.forEach(function(q){
      var x=q[0], y=q[1], edge=false;
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){ var k=(x+d[0])+','+(y+d[1]); if(!mask[k] && p.get(x+d[0],y+d[1])) edge=true; });
      if (edge) p.s(x,y,'K');
      else if (!mask[x+','+(y+1)]) p.s(x,y,'k');
    });
    // highlight streak along the first segment
    var a0=pts[0], a1=pts[1]; p.s(Math.round((a0[0]+a1[0])/2)-1, Math.round((a0[1]+a1[1])/2), 'J');
    // cuff
    var e=pts[pts.length-1], f=pts[pts.length-2], ux=Math.sign(e[0]-f[0]), uy=Math.sign(e[1]-f[1]);
    for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++) if (mask[(e[0]+i)+','+(e[1]+j)]) p.s(e[0]+i,e[1]+j,'k');
    return [e[0]+ux, e[1]+uy];
  }

  var HANDS = {
    wave:  [".sss.", "sssss", "sssss", "ssssd", ".sdd."],       // open palm, thumb added on the left
    grip:  ["sss", "ssd", "dsd"],
    palm:  ["s....", "sssss", "dsssd"],
    type0: ["sss", "ddd"],
    type1: ["...", "sss"]
  };
  // draw a small shape and ring it with the outline color, so props and hands stay crisp over the body
  function outlined(p, x, y, rows){
    var inS={}, j, i;
    for (j=0;j<rows.length;j++) for (i=0;i<rows[j].length;i++) if (rows[j][i]!=='.') inS[(x+i)+','+(y+j)]=1;
    for (var k in inS){ var q=k.split(','), qx=+q[0], qy=+q[1];
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){ var nk=(qx+d[0])+','+(qy+d[1]); if(!inS[nk]) p.s(qx+d[0],qy+d[1],'o'); }); }
    p.block(x, y, rows);
  }
  function hand(p, x, y, kind){
    var rows=HANDS[kind].slice();
    if (kind==='wave'){ rows=rows.map(function(r,i){ return (i===2||i===3?'s':'.')+r; }); x-=1; }
    outlined(p, x, y, rows);
  }
  function pocketHand(p){ dropArm(p,'L'); limb(p, [[7,25],[6,30],[9,33]]); p.s(9,34,'K'); p.s(10,33,'K'); }

  // ---------- face ----------
  // eyes: left x11-13, right x18-20, rows 13-15. mouth rows 18-19, x14-18.
  var EYES = {
    open:  [["gAo","wog","wBw"],["gAo","woo","wBw"]],
    shut:  [["ddd","ooo","sss"],["ddd","ooo","sss"]],
    focus: [["ooo","ooo","wBw"],["ooo","ooo","wBw"]],
    wide:  [["ggg","wow","www"],["ggg","wow","www"]],
    right: [["gAo","wwo","wwB"],["gAo","wwo","wwB"]],
    happy: [["ddd","sos","oso"],["ddd","sos","oso"]]
  };
  function eyes(h, kind){ var e=EYES[kind]; for (var i=0;i<3;i++){ h.s(11,13+i,e[0][i]); h.s(18,13+i,e[1][i]); } }
  var MOUTH = {
    flat:  ["sDDDs","sssss"],
    grin:  ["DwwwD","sDDDs"],
    smile: ["dsssd","sDDDs"],
    o:     ["sDoDs","ssDss"],
    small: ["ssDss","sssss"],
    chew:  ["sDsDs","ssDss"],
    open:  ["sDoDs","sDDDs"]
  };
  function mouth(h, kind){ var m=MOUTH[kind]; h.s(14,18,m[0]); h.s(14,19,m[1]); }

  // ---------- props ----------
  function desk(p){
    p.rect(-2,38,36,1,'F'); p.rect(-2,39,36,1,'f');
    p.rect(-1,40,34,8,'e'); p.rect(0,43,32,1,'f'); p.s(14,44,'FFFF');
    p.rect(-1,48,2,7,'e'); p.rect(31,48,2,7,'e');
  }
  function chair(p){
    var r=[]; r.push('.'+'z'.repeat(24)+'.'); for (var j=0;j<11;j++) r.push('z'+'Z'.repeat(24)+'z');
    outlined(p, 3, 27, r);
  }
  function laptopOnDesk(p){
    outlined(p, 7, 30, [
      "...LLLLLLLLLLLL...",
      "...LNNLLLLLLLLL...",
      "...LNLLLLLLLLLL...",
      "...LLLLLLYYLLLL...",
      "...LLLLLLYYLLLL...",
      "...LLLLLLLLLLLL...",
      "...MMMMMMMMMMMM...",
      "NNNNNNNNNNNNNNNNNN"
    ]);
  }
  function mug(p, x, y){ outlined(p, x, y, ["uuu..","nnnVV","nnn.V","nnnVV","VVV.."]); }
  function pillowBed(p){
    p.rect(-1,-2,34,5,'e'); p.rect(0,-2,32,1,'F');                 // headboard
    p.rect(-1,3,2,52,'e'); p.rect(31,3,2,52,'e');                 // rails
    p.rect(1,3,30,52,'V');                                         // mattress
    p.rect(3,4,26,17,'n'); p.rect(3,20,26,1,'V'); p.s(3,4,'V'); p.s(28,4,'V');   // pillow
  }
  function blanket(p, lift){
    var y0=21+lift;
    p.rect(1,y0,30,55-y0,'U');
    p.rect(1,y0,30,2,'n'); p.rect(1,y0+2,30,1,'V');               // folded sheet
    for (var y=y0+7;y<55;y+=7) p.rect(1,y,30,1,'I');
    for (var x=6;x<31;x+=8) p.rect(x,y0+3,1,55-y0-3,'I');
  }
  function pizza(p, x, y, bites){   // upright slice, tip up, held by the crust
    var rows=[
      "...G...",
      "..GGG..",
      "..GrG..",
      ".GGGGG.",
      ".rGGGr.",
      "GGGrGGG",
      "GrGGGGG",
      "bbbbbbb",
      "ubbbbbu"
    ];
    if (bites>0){ rows[0]="......."; rows[1]="...G..."; }
    if (bites>1){ rows[1]="......."; rows[2]="......."; }
    outlined(p, x, y, rows);
  }
  function plate(p, x, y){ p.s(x,y,".nnnnnnn."); p.s(x,y+1,"VnnnnnnnV"); p.s(x+1,y+2,"VVVVVVV"); p.s(x+2,y-1,"GGrGb"); }
  function envelope(p, x, y){ outlined(p,x,y,["VVVVVVVV","nVnnnnVn","nnVnnVnn","nnnVVnnn","nnnRRnnn","nnnnnnnn"]); }
  function bang(p, x, y){ p.block(x,y,["OO","OO","OO","OO","..","OO"]); }
  function qmark(p, x, y){ p.block(x,y,[".OOO.","OO.OO","...OO","..OO.","..OO.",".....","..OO."]); }

  // ---------- effects (after outline, empty pixels only) ----------
  function fx(g, mood, t, st){
    var put=function(x,y,c){ x+=OX; y+=OY; if(x>=0&&y>=0&&x<W&&y<H&&!g.c[y][x]) g.c[y][x]=c; };
    var force=function(x,y,c){ x+=OX; y+=OY; if(x>=0&&y>=0&&x<W&&y<H) g.c[y][x]=c; };
    if (mood==='sleep'){
      var ph=t%24, zc='#8C95A6';
      var Z=function(x,y,n){ for(var i=0;i<n;i++){ put(x+i,y,zc); put(x+i,y+n-1,zc); } for(var k=1;k<n-1;k++) put(x+n-1-k,y+k,zc); };
      if (ph<20) Z(33, 3-(ph>>2), 5);
      if (ph>=6) Z(34, 12-((ph-6)>>2), 4);
    }
    if (mood==='hello'){
      var arc='#8C95A6', f=st.wave;
      if ((t%6)<3){ put(32,6,'#E6A93A'); put(37,8,'#E6A93A'); put(35,5,'#E6A93A'); }
    }
    if (mood==='work'){
      var cs=['#7FB3FF','#9BD7A0','#F2C66D','#E48FB0'];
      for (var i=0;i<2;i++){ var q=(t+i*6)%12; if(q<8) put(12+i*7, 29-q, cs[(i+(t>>3))%4]); }
      var sp=t%12; if(sp<9){ put(26+((sp>>2)%2), 32-(sp>>1), '#C9CED6'); }
    }
    if (mood==='eat' && st.crumb>=0){ put(17+st.crumb%2, 22+st.crumb, '#C98A3E'); put(15, 23+st.crumb, '#F2C14E'); }
    if (mood==='reach' && (t%8)<4){ put(36,9,'#E6A93A'); put(37,11,'#E6A93A'); put(35,7,'#E6A93A'); }
  }

  var VERSION = '1.3.0';
  var MOODS = ['idle','sleep','awake','hello','work','eat','ask','reach','plant','lift','lab','celebrate','read'];
  // ticks after which each state repeats exactly (awake is a one-shot and holds its last frame)
  var LOOPS = { idle:48, sleep:48, awake:4, hello:48, work:96, eat:72, ask:48, reach:48,
               plant:48, lift:48, lab:48, celebrate:48, read:48 };

  function buildBase(mood, t, opts){
    opts=opts||{};
    var g=new Grid(), blink=(t%48)>=46, st={wave:0,crumb:-1};
    if (mood==='eat') blink=(t%72)===9||(t%72)===10;

    if (mood==='sleep' || mood==='awake'){
      var bed=pen(g,0,0);
      pillowBed(bed);
      var hop = mood==='awake' ? [-2,-1,0,0][Math.min(t,3)] : 0;
      var h=pen(g,0,hop);
      drawHead(h);
      if (mood==='sleep'){ eyes(h,'shut'); mouth(h,'small'); blanket(bed, ((t>>3)%2)); hand(bed, 21, 25+((t>>3)%2), 'grip'); }
      else { eyes(h,'wide'); mouth(h,'o'); blanket(bed, 1); hand(bed, 5, 23, 'grip'); hand(bed, 24, 23, 'grip'); bang(pen(g,0,0), 35, 0); }
    }
    else if (mood==='work'){
      var S=6, back=pen(g,0,S), fr=pen(g,0,0);
      chair(back);
      drawTorso(back);
      dropArm(back,'L','Z'); dropArm(back,'R','Z');
      var hb=((t>>4)%2), h2=pen(g,0,S+hb);
      drawHead(h2);
      eyes(h2, blink?'shut':'focus'); mouth(h2,'flat');
      drawLegs(fr);                         // shins and shoes show under the desk
      desk(fr);
      laptopOnDesk(fr);
      mug(fr, 26, 34);
      // forearms reach forward onto the keyboard, hands tap alternately
      var tp=(t>>1)%2;
      limb(fr, [[7,31],[6,34],[9,36]]);  hand(fr, 9, 36, tp?'type0':'type1');
      limb(fr, [[24,31],[25,34],[22,36]]); hand(fr, 20, 36, tp?'type1':'type0');
    }
    else {
      var b=pen(g,0,0), hd=0;
      if (mood==='hello') hd=((t>>2)%4)===1?-1:0;
      if (mood==='idle')  hd=(t%24)>=20?1:0;
      drawLegs(b); drawTorso(b);
      var hh=pen(g,0,hd);
      drawHead(hh);
      if (mood==='idle'){
        eyes(hh, blink?'shut':'open'); mouth(hh,'smile');
        pocketHand(b);
        b.s(23,37,'___'); b.s(23,38,'___'); hand(b, 23, 37, 'grip');
      }
      if (mood==='hello'){
        eyes(hh, blink?'shut':'happy'); mouth(hh,'grin');
        pocketHand(b); dropArm(b,'R');
        st.wave=[0,1,2,1][(t>>1)%4];
        var wx=[33,35,37][st.wave];
        limb(b, [[24,25],[29,23],[wx,17]]);
        hand(b, wx-2, 11, 'wave');
      }
      if (mood==='eat'){
        // 24-frame loop: 0-11 chew with the slice lowered, 12-15 raise, 16-23 bite
        var ph=t%24, bites=((t/24)|0)%3;
        pocketHand(b);
        dropArm(b,'R');
        if (ph<12){
          eyes(hh, blink?'shut':'open'); mouth(hh, (ph>>1)%2?'chew':'flat');
          limb(b, [[24,25],[25,32],[21,33]]); pizza(b, 16, 23, bites); hand(b, 18, 32, 'grip');
        } else if (ph<16){
          eyes(hh,'open'); mouth(hh,'open');
          limb(b, [[24,25],[25,31],[21,29]]); pizza(b, 15, 20, bites); hand(b, 17, 29, 'grip');
        } else {
          eyes(hh,'happy'); mouth(hh,'open');
          limb(b, [[24,25],[25,31],[20,27]]); pizza(b, 13, 18, bites); hand(b, 15, 27, 'grip');
          if (ph>=18 && ph<22) st.crumb=ph-18;
        }
      }
      if (mood==='ask'){
        eyes(hh, blink?'shut':'right'); mouth(hh,'smile');
        pocketHand(b); dropArm(b,'R');
        limb(b, [[24,25],[25,31],[30,30]]);
        hand(b, 31, 28, 'palm');
        qmark(pen(g,0,((t>>2)%2)?-1:0), 32, 17);
      }
      if (mood==='reach'){
        eyes(hh, blink?'shut':'right'); mouth(hh,'grin');
        pocketHand(b); dropArm(b,'R');
        var ey=((t>>2)%2)?-1:0;
        limb(b, [[24,25],[30,25],[32,19+ey]]);
        envelope(b, 29, 11+ey);
        hand(b, 31, 17+ey, 'grip');
      }
    }

    g.outline();
    if (!opts.noFx) fx(g, mood, t, st);
    return g;
  }

  function color(ch){ return PAL[ch] || ch; }

  // ---------- timeline poses ----------
  // Each pose is an approved edit of an existing frame, applied in absolute pixel coordinates on
  // colors (not keys) so the result matches the approved 48-frame sheets exactly.
  var INK = '#1E1B2B', SPARK = '#E6A93A', NONE = null;
  var REV = {}; (function(){ for (var k in PAL){ var v = PAL[k].toUpperCase(); if (!(v in REV)) REV[v] = k; } })();
  function hex(ch){ return ch ? color(ch).toUpperCase() : NONE; }
  function src(mood, t){                                // an existing frame as a grid of colors
    var c = buildBase(mood, t, {}).c, out = [];
    for (var y=0;y<H;y++){ var r=[]; for (var x=0;x<W;x++) r.push(hex(c[y][x])); out.push(r); }
    return out;
  }
  function inb(x, y){ return x>=0 && y>=0 && x<W && y<H; }
  function clearSpark(f){ for (var y=0;y<H;y++) for (var x=0;x<W;x++) if (f[y][x]===SPARK) f[y][x]=NONE; }
  function erase(f, x0, y0, x1, y1){ for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++) f[y][x]=NONE; }
  function shape(f, fills){                             // paint fills, then outline into empty neighbours
    var keys = Object.keys(fills), i, d, N=[[1,0],[-1,0],[0,1],[0,-1]];
    for (i=0;i<keys.length;i++){ var p=keys[i].split(','); f[+p[1]][+p[0]] = fills[keys[i]]; }
    for (i=0;i<keys.length;i++){ var q=keys[i].split(','), x=+q[0], y=+q[1];
      for (d=0;d<4;d++){ var nx=x+N[d][0], ny=y+N[d][1];
        if (!((nx+','+ny) in fills) && inb(nx,ny) && !f[ny][nx]) f[ny][nx]=INK; } }
  }
  function ring(f, x0, y0, x1, y1, fill){
    for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++) f[y][x] = (x===x0||x===x1||y===y0||y===y1) ? INK : fill(x,y);
  }
  function recolor(f, y0, y1, map){
    for (var y=y0;y<=y1;y++) for (var x=0;x<W;x++){ var c=f[y][x]; if (c && map[c]) f[y][x]=map[c]; }
  }
  function headTop(f){ for (var y=0;y<H;y++) for (var x=10;x<37;x++) if (f[y][x]) return y; return 0; }
  function idleHead(f, t){                             // share the idle blink and head bob
    var h = src('idle', t%48);
    for (var y=4;y<28;y++) for (var x=10;x<37;x++) f[y][x] = h[y][x];
    return f;
  }
  function tint(c, to){                                // 45% toward a lens color, truncated per channel
    var a = 0.45, out = '#';
    for (var i=0;i<3;i++){
      var v = c ? parseInt(c.slice(1+i*2, 3+i*2), 16) : 0, w = parseInt(to.slice(1+i*2, 3+i*2), 16);
      var m = Math.floor(v*(1-a) + w*a); out += (m<16?'0':'') + m.toString(16).toUpperCase();
    }
    return out;
  }
  function col(n){ return PAL[n].toUpperCase(); }
  var CONFETTI = [[6,12,'ib'],[7,12,'ib'],[4,21,'k3'],[4,22,'k3'],[8,30,'bk'],[9,30,'bk'],[42,10,'sm'],[43,10,'sm'],
    [38,13,'k3'],[46,14,'ib'],[46,15,'ib'],[47,31,'bk'],[47,32,'bk'],[3,36,'sm'],[3,37,'sm'],[30,3,'ib'],[31,3,'ib'],
    [14,4,'bk'],[15,4,'bk'],[22,2,'k3'],[23,2,'k3'],[36,6,'bk']];

  function posePlant(sway){                           // reach pose, envelope swapped for a potted sprout
    var f = src('reach', 10), fills = {}, x, y;
    clearSpark(f); erase(f, 36, 8, 49, 22); erase(f, 35, 16, 35, 22);
    var G=col('sl'), g=col('sm'), D=col('sd'), put=function(x,y,c){ fills[x+','+y]=c; }, L=function(x,y,c){ put(x+sway,y,c); };
    for (y=12;y<17;y++) put(40,y,D);
    L(37,12,G); L(38,12,G);
    [[36,13],[37,13],[38,13],[39,13],[37,14],[38,14]].forEach(function(p){ L(p[0],p[1],g); });
    L(39,14,D);
    L(42,10,G); L(43,10,G);
    [[41,11],[42,11],[43,11],[44,11],[42,12],[43,12]].forEach(function(p){ L(p[0],p[1],g); });
    L(41,12,D);
    put(40,9,G); put(40,10,g); put(40,11,g); put(39,9,G);
    for (x=37;x<44;x++) put(x,17,col('pd'));
    for (x=37;x<44;x++) put(x,18,col('pr'));
    for (y=19;y<22;y++) for (x=38;x<43;x++) put(x,y, x===42 ? col('ps') : col('pb'));
    shape(f, fills);
    return f;
  }
  function poseLab(t){                                  // idle pose in a lab coat with safety glasses
    var f = src('idle', t%48), dy = headTop(f)-5, x, y, i;
    var coat = {}; coat[col('j')]=col('a1'); coat[col('k')]=col('a2'); coat[col('K')]=col('a3');
    coat[col('J')]=col('a4'); coat[col('c')]=col('a5'); coat[col('q')]=col('a6');
    recolor(f, 26, 42, coat);
    ring(f, 27, 31, 30, 34, function(x,y){ return y===32 ? col('ib') : col('a4'); });
    f[30][14]=col('ip'); f[31][14]=col('ip');
    var lens=[[17,21],[24,28]];
    for (i=0;i<2;i++){ var x0=lens[i][0], x1=lens[i][1];
      for (y=19+dy;y<22+dy;y++) for (x=x0;x<=x1;x++) f[y][x]=tint(f[y][x], '#BFE3F5');
      for (x=x0-1;x<x1+2;x++){ f[18+dy][x]=INK; f[22+dy][x]=INK; }
      for (y=19+dy;y<22+dy;y++){ f[y][x0-1]=INK; f[y][x1+1]=INK; }
      f[19+dy][x0 + (((t/12)|0)%2 ? 1 : 0)] = col('a4');   // glint slides 1px
    }
    f[19+dy][22]=INK; f[19+dy][23]=INK;
    return f;
  }
  function poseCelebrate(t, fx){                        // the hello wave with confetti drifting down
    var f = src('hello', (12+t)%48);
    clearSpark(f);
    if (fx) for (var i=0;i<CONFETTI.length;i++){ var c=CONFETTI[i], yy = 1 + (c[1]-1 + ((t/2)|0)) % 61;
      if (!f[yy][c[0]]) f[yy][c[0]] = col(c[2]); }
    return f;
  }
  function poseRead(dip){                               // holding a blue book at chest height
    var f = src('eat', 30), x, y, pizzaC = {}, BL=col('ib'), BD=col('t1'), PG=col('k1');
    ['#F2C14E','#C8463C','#C98A3E','#5A3526'].forEach(function(c){ pizzaC[c]=1; });
    for (y=29;y<41;y++) for (x=20;x<33;x++) if (f[y][x] && pizzaC[f[y][x]]) f[y][x]=col('j');
    for (y=28+dip;y<39+dip;y++){ var yb=y-dip;
      for (x=20;x<33;x++) f[y][x] = (x===20||x===32||yb===28||yb===38) ? INK : x===21 ? BD : yb===37 ? PG : BL; }
    for (x=24;x<31;x++) f[31+dip][x]=col('bk');
    for (x=25;x<30;x++) f[33+dip][x]=PG;
    [[19,34],[19,35],[33,34],[33,35]].forEach(function(p){ f[p[1]+dip][p[0]]=INK; });
    [[20,34],[20,35],[32,34],[32,35]].forEach(function(p){ f[p[1]+dip][p[0]]=col('s'); });
    return f;
  }
  function poseLift(bob, sweat){                        // gym clothes, barbell at shoulder height
    var f = src('eat', 30), g = src('idle', 0), x, y, i;
    for (y=29;y<42;y++) for (x=19;x<32;x++) f[y][x]=g[y][x];
    var top = {}; top[col('j')]=col('ib'); top[col('k')]=col('t1'); top[col('K')]=col('t2'); top[col('J')]=col('t3');
    top[col('c')]=col('ib'); top[col('q')]=col('t1'); top[col('t')]=col('t1');
    recolor(f, 26, 42, top);
    for (x=23;x<27;x++) f[27][x]=col('s');                            // neckline
    var shade=col('Q');
    for (y=43;y<58;y++) for (x=0;x<W;x++){ var c=f[y][x];            // shorts, legs, socks
      if (!c || c===INK) continue;
      if (y<=49) f[y][x] = c!==shade ? col('h1') : col('h2');
      else if (y<=56) f[y][x] = c===shade ? col('d') : col('s');
      else f[y][x] = col('a4');
    }
    for (x=17;x<29;x++) if (f[49][x] && f[49][x]!==INK) f[49][x]=INK;
    var shoes = {}; shoes[col('x')]=col('k1'); shoes[col('X')]=col('k2'); shoes[col('z')]=col('k3'); shoes[col('W')]=col('k4');
    recolor(f, 58, 61, shoes);
    var b = -bob;                                                     // bob lifts the bar 1px
    for (x=2;x<48;x++){ f[31+b][x]=INK; f[34+b][x]=INK; f[32+b][x]=col('b1'); f[33+b][x]=col('b2'); }
    var plate = function(x,y){ return (y===26+b||y===27+b) ? col('b2') : (y>=38+b ? col('b4') : col('b3')); };
    ring(f, 2, 25+b, 6, 40+b, plate); ring(f, 43, 25+b, 47, 40+b, plate);
    ring(f, 7, 28+b, 8, 37+b, function(){ return col('b3'); }); ring(f, 41, 28+b, 42, 37+b, function(){ return col('b3'); });
    var fists=[[15,19],[30,34]];
    for (i=0;i<2;i++){ var x0=fists[i][0], x1=fists[i][1];
      for (y=30+b;y<36+b;y++) for (x=x0;x<=x1;x++) f[y][x] = (x===x0||x===x1||y===30+b||y===35+b) ? INK : col('s');
      f[32+b][x0+2]=col('d'); f[33+b][x0+2]=col('d');
    }
    if (sweat){ f[16][9]=col('sw'); f[17][9]=col('sw'); f[17][8]=col('sw'); }   // sweat drop
    return f;
  }
  var POSES = {
    plant:     function(t){ return posePlant([0,1,0,-1][((t/6)|0)%4]); },
    lift:      function(t, fx){ return idleHead(poseLift((t%8)<4 ? 1 : 0, fx && ((t/6)|0)%2===0), t); },
    lab:       function(t){ return poseLab(t); },
    celebrate: function(t, fx){ return poseCelebrate(t, fx); },
    read:      function(t){ return idleHead(poseRead((t%24)>=20 ? 1 : 0), t); }
  };
  function buildPose(mood, t, opts){
    var f = POSES[mood](t % 48, !opts.noFx), g = new Grid();   // approved loops are 48 ticks
    for (var y=0;y<H;y++) for (var x=0;x<W;x++){ var c=f[y][x]; if (c) g.c[y][x] = REV[c] || c; }
    return g;
  }
  function build(mood, t, opts){
    opts = opts || {};
    return POSES[mood] ? buildPose(mood, t, opts) : buildBase(mood, t, opts);
  }

  // draw one frame into any 2D context at an integer scale, offset in device pixels
  function draw(ctx, mood, t, scale, opts){
    scale = Math.max(1, scale|0); opts = opts || {};
    var g = build(mood, t, opts), ox = opts.x|0, oy = opts.y|0, last = null;
    for (var y=0;y<H;y++) for (var x=0;x<W;x++){
      var ch = g.c[y][x]; if (!ch) continue;
      var c = color(ch); if (c !== last){ ctx.fillStyle = c; last = c; }
      ctx.fillRect(ox + x*scale, oy + y*scale, scale, scale);
    }
  }
  function paint(cv, mood, t, opts){
    var ctx = cv.getContext('2d'), scale = Math.max(1, Math.floor(cv.width / W));
    ctx.clearRect(0, 0, cv.width, cv.height);
    draw(ctx, mood, t, scale, opts);
  }
  // frame as an RGBA byte array (W*H*4), used by exporters
  function rgba(mood, t, opts){
    var g = build(mood, t, opts), out = new Array(W*H*4).fill(0);
    for (var y=0;y<H;y++) for (var x=0;x<W;x++){
      var ch = g.c[y][x]; if (!ch) continue; var c = color(ch), i = (y*W+x)*4;
      out[i]=parseInt(c.slice(1,3),16); out[i+1]=parseInt(c.slice(3,5),16); out[i+2]=parseInt(c.slice(5,7),16); out[i+3]=255;
    }
    return out;
  }
  return { VERSION:VERSION, W:W, H:H, PAL:PAL, MOODS:MOODS, LOOPS:LOOPS, build:build, draw:draw, paint:paint, rgba:rgba };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = PixelAnirudh;
