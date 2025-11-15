//export const stranger_tune = `setcps(140/60/4)

//samples('github:algorave-dave/samples')
//samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
//samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

//const gain_patterns = [
//  "2",
//  "{0.75 2.5}*4",
//    "{0.75 2.5!9 0.75 2.5!5 0.75 2.5 0.75 2.5!7 0.75 2.5!3 <2.5 0.75> 2.5}%16",
//]

//const drum_structure = [
//"~",
//"x*4",
//"{x ~!9 x ~!5 x ~ x ~!7 x ~!3 < ~ x > ~}%16",
//]

//const basslines = [
//  "[[eb1, eb2]!16 [f2, f1]!16 [g2, g1]!16 [f2, f1]!8 [bb2, bb1]!8]/8",
//  "[[eb1, eb2]!16 [bb2, bb1]!16 [g2, g1]!16 [f2, f1]!4 [bb1, bb2]!4 [eb1, eb2]!4 [f1, f2]!4]/8"
//]

//const arpeggiator1 = [
//"{d4 bb3 eb3 d3 bb2 eb2}%16",
//"{c4 bb3 f3 c3 bb2 f2}%16",
//"{d4 bb3 g3 d3 bb2 g2}%16",
//"{c4 bb3 f3 c3 bb2 f2}%16",
//]

//const arpeggiator2 = [
//"{d4 bb3 eb3 d3 bb2 eb2}%16",
//"{c4 bb3 f3 c3 bb2 f2}%16",
//"{d4 bb3 g3 d3 bb2 g2}%16",
//"{d5 bb4 g4 d4 bb3 g3 d4 bb3 eb3 d3 bb2 eb2}%16",
//]


//const pattern = 0
//const bass = 0

//bassline:
//note(pick(basslines, bass))
//.sound("supersaw")
//.postgain(2)
//.room(0.6)
//.lpf(700)
//.room(0.4)
//.postgain(pick(gain_patterns, pattern))


//main_arp:
//note(pick(arpeggiator1, "<0 1 2 3>/2"))
//.sound("supersaw")
//.lpf(300)
//.adsr("0:0:.5:.1")
//.room(0.6)
//.lpenv(3.3)
//.postgain(pick(gain_patterns, pattern))


//drums:
//stack(
//  s("tech:5")
//  .postgain(6)
//  .pcurve(2)
//  .pdec(1)
//  .struct(pick(drum_structure, pattern)),

//  s("sh").struct("[x!3 ~!2 x!10 ~]")
//  .postgain(0.5).lpf(7000)
//  .bank("RolandTR808")
//  .speed(0.8).jux(rev).room(sine.range(0.1,0.4)).gain(0.6),

//  s("{~ ~ rim ~ cp ~ rim cp ~!2 rim ~ cp ~ < rim ~ >!2}%8 *2")
//  .bank("[KorgDDM110, OberheimDmx]").speed(1.2)
//  .postgain(.25),
//)

//drums2:
//stack(
//  s("[~ hh]*4").bank("RolandTR808").room(0.3).speed(0.75).gain(1.2),
//  s("hh").struct("x*16").bank("RolandTR808")
//  .gain(0.6)
//  .jux(rev)
//  .room(sine.range(0.1,0.4))
//  .postgain(0.5),

//  s("[psr:[2|5|6|7|8|9|12|24|25]*16]?0.1")
//  .gain(0.1)
//  .postgain(pick(gain_patterns, pattern))
//  .hpf(1000)
//  .speed(0.5)
//  .rarely(jux(rev)),
//)
////Remixed and reproduced from Algorave Dave's code found here: https://www.youtube.com/watch?v=ZCcpWzhekEY
//// all(x => x.gain(mouseX.range(0,1)))
//// all(x => x.log())

//// @version 1.2`;





// "theres no soul here" @by froos //this music starts after few second due to the combination of the beats in the coding //Enjoy the  music
// @date 23-08-21
// @version 1.0

//--------this music starts after few second due to the combination of the beats in the coding---------------------------------------
//--------Enjoy the  music-----------------------------------------------------------------------------------------------------------
//--------I have made some changes in the original tune to support the P1radio buttons and the colume slider with some tokens--------


export const stranger_tune = `
// ==== harmony ====
<tempoLine>
let chords = arrange(
    [16, "<Fm!3 [Fm!3 Em]>/2"],
    [16, "<Fm <Cm C>>/2"],
    [8, "<Db>/2"],
    [8, "<Gb>/2"],
).chord()


let warble = x => x.add(note(perlin.range(0, .5)))

// ==== layers ====

// Guitar (unchanged)
let guitar = chords.s("sawtooth")
    .dict('legacy').voicing().fm(8).fmh(1.0009).gain(.25)
    .lpf(perlin.range(900, 4000)).lpq(8)
    .struct("[~ x]*2").clip(.5).delay(".5:.125:.8").room(1)
    .layer(warble)
//  .hush()

// Piano — token inserted so every 3rd slot toggles to a rest when HUSH
let piano = n("<0 4 <p1_Radio> 2>*[<3 2>/32]")
    .set(chords).s('piano').dict('legacy').voicing()
    .inside(2, juxBy(.5, rev))
    .lpf(2000).gain(.5).room(perlin.slow(2))
    .layer(warble)
//  .hush()

// Bass (unchanged)
let bass = n("2").set(chords).anchor(chords.rootNotes(1))
    .dict('legacy').voicing()
    .s("gm_acoustic_bass")
    .sometimesBy("0 .5", add(note("12")))
    .ply(2).clip(.5).ply("<1!4 [2 3]>")
    .lpf(900).lpq(2).attack(.02).ds(".1:.5").release(.02)
    .layer(warble)
    .gain(3)
//  .hush()

// Drums — token inserted right after first bd slot
let drums = s("bd <p1_Radio> [~@1 bd:0:.5?],~@1.02 [sd,rim],hh*4")
    .gain(.8).bank('RolandTR707').speed(.8)
    .off(-1 / 8, x => x.mul(gain(.25)).degrade().speed(.7))
//  .hush()

//////////////////////////////
// PR: https://github.com/tidalcycles/strudel/issues/670
let binpatn = (dec, len) => seq(
    ...(typeof dec === 'string' ? [1] :
        dec.toString(2)
            .padStart(len, '0')
            .split('')
            .map(Number)
    )
)
// registers a binpat mask with the given length
let maskn = (n) => register('mask' + n, (dec, pat) =>
    pat.mask(
        reify(dec).fmap(v => binpatn(v, n)).squeezeJoin()
    ), false)

let mask2 = maskn(2)
let mask3 = maskn(3)
let mask4 = maskn(4)
//////////////////////////////

stack(
    drums.mask4("<0 0 0 1 x!4 7 x x x 9 x x x x x 0 0 0 0>/2"),
    guitar.mask4("<0 0 0 0 0!4 x x x x x x x x x x x 9 x x x x>/2"),
    piano.mask4("<x x x x x!4 x x x x x x x x x x x x x x x x x x>/2"),
    bass.mask4("<0 0 x x x!4 x x x x x x x x 0 0 0 1 x x x x x x x x>/2"),
)
    .add(room(.25)).gain(<volume>)`

