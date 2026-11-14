'use strict';
// Visual rules for post-test review. Finite examples do not prove a unique possible continuation.
const question_explanations = {
  "1": {
    "title": "Keep the figure unchanged",
    "rule": "Every position in each example row contains the same blue circle. Neither the shape, colour nor size changes.",
    "application": "The last row already contains two identical blue circles. Another identical blue circle completes it.",
    "da": {
      "title": "Bevar figuren",
      "rule": "Alle tre billeder i hver eksempelrække viser den samme blå cirkel. Form, farve og størrelse ændres ikke.",
      "application": "Sidste række har allerede to ens blå cirkler. En tredje identisk cirkel fuldender rækken."
    }
  },
  "2": {
    "title": "Add one nested outline",
    "rule": "Moving right adds a smaller outline of the same shape inside the previous one. The outer shape and its colour stay unchanged.",
    "application": "The green triangle has one inner triangle in the middle position. Add one more, smaller inner triangle to obtain the answer.",
    "da": {
      "title": "Tilføj en indre kontur",
      "rule": "For hvert trin mod højre tilføjes en mindre kontur af samme figur indeni. Den ydre form og farven bevares.",
      "application": "Den grønne trekant har én indre trekant i midten. Tilføj endnu en mindre trekant indeni."
    }
  },
  "3": {
    "title": "Use the first shape as a cut-out",
    "rule": "The black shape in the first position is removed from the centre of the coloured square in the second position. The hole is white.",
    "application": "The black square makes a square hole in the green square. Choose the green square with the white square opening.",
    "da": {
      "title": "Brug den sorte figur som udskæring",
      "rule": "Den sorte figur i første billede skæres ud af midten af den farvede firkant i andet billede. Hullet er hvidt.",
      "application": "Den sorte firkant giver et firkantet hul i den grønne firkant. Vælg den grønne firkant med det hvide, firkantede hul."
    }
  },
  "4": {
    "title": "Combine the upper and lower colours",
    "rule": "The result takes its upper half from the first capsule and its lower half from the second capsule.",
    "application": "The first capsule is white and the second is blue, so the result is white above and blue below.",
    "da": {
      "title": "Kombinér farverne foroven og forneden",
      "rule": "Resultatet får sin øverste halvdel fra den første kapsel og sin nederste halvdel fra den anden.",
      "application": "Første kapsel er hvid og anden kapsel blå. Resultatet bliver derfor hvidt foroven og blåt forneden."
    }
  },
  "5": {
    "title": "Rotate the coloured lobes",
    "rule": "At each step, turn the whole four-lobed figure 90 degrees clockwise. Every red and blue lobe moves with the figure.",
    "application": "Turn the middle figure another quarter-turn clockwise. The two red lobes finish on the right and at the bottom; the top and left lobes are blue.",
    "da": {
      "title": "Drej hele figuren",
      "rule": "Drej hele figuren med fire buer 90 grader med uret for hvert trin. Alle røde og blå dele følger med.",
      "application": "Drej midterfiguren endnu en kvart omgang med uret. De røde dele ender til højre og forneden; de blå ender foroven og til venstre."
    }
  },
  "6": {
    "title": "Round the corners progressively",
    "rule": "The colour and general shape remain the same while the corners become more rounded at each step.",
    "application": "Continue rounding the corners of the brown rectangle. The answer is the brown capsule with fully rounded ends.",
    "da": {
      "title": "Afrund hjørnerne mere og mere",
      "rule": "Farven og grundformen bevares, mens hjørnerne bliver mere afrundede for hvert trin.",
      "application": "Fortsæt afrundingen af det brune rektangel. Resultatet er den brune kapsel med helt afrundede ender."
    }
  },
  "7": {
    "title": "Continue the circle’s movement",
    "rule": "Within each row the green circle moves the same distance in the same direction: upward, downward or horizontally. Its size stays fixed.",
    "application": "In the last row the circle moves left along the bottom of the square. One more equal step places it at the bottom left.",
    "da": {
      "title": "Fortsæt cirklens bevægelse",
      "rule": "I hver række bevæger den grønne cirkel sig lige langt i samme retning for hvert trin. Størrelsen er uændret.",
      "application": "I sidste række flytter cirklen mod venstre langs firkantens bund. Endnu et lige langt trin placerer den nederst til venstre."
    }
  },
  "8": {
    "title": "Turn the entire dot pattern",
    "rule": "Rotate the square and all its dots 45 degrees counterclockwise at each step. The square becomes a diamond, then a square again.",
    "application": "Turn the middle green-and-black diamond another 45 degrees counterclockwise. Keep the green and black dots in their rotated positions.",
    "da": {
      "title": "Drej hele prikmønstret",
      "rule": "Drej firkanten og alle dens prikker 45 grader mod uret for hvert trin. Firkanten bliver først en rombe og derefter en firkant igen.",
      "application": "Drej den grønne og sorte rombe i midten endnu 45 grader mod uret. Alle prikker skal følge med i drejningen."
    }
  },
  "9": {
    "title": "Shorten each bar from the top",
    "rule": "At every step, each vertical black bar loses one grid interval from its upper end. Its lower end stays on the bottom line. A bar disappears when its length reaches zero.",
    "application": "The middle picture has a one-interval middle bar and a two-interval right bar. The middle bar disappears, leaving a one-interval bar on the right.",
    "da": {
      "title": "Forkort søjlerne fra toppen",
      "rule": "Hver lodret sort søjle mister ét gitterinterval fra sin øverste ende. Den nederste ende bliver på bundlinjen. En søjle forsvinder, når længden bliver nul.",
      "application": "Midterbilledet har en søjle på ét interval i midten og to intervaller til højre. Den midterste forsvinder, og den højre forkortes til ét interval."
    }
  },
  "10": {
    "title": "Reflect across the black line",
    "rule": "The middle line is a mirror axis. Reflect the coloured shape in that line rather than simply rotating it.",
    "application": "The last mirror line is vertical, so the yellow shape is flipped left to right. Its colour and size remain unchanged.",
    "da": {
      "title": "Spejl i den sorte linje",
      "rule": "Linjen i midten er en spejlakse. Figuren skal spejles i linjen.",
      "application": "Den sidste spejlakse er lodret. Den gule figur spejles derfor fra venstre mod højre, mens farve og størrelse bevares."
    }
  },
  "11": {
    "title": "Overlay the shapes and use the first colour",
    "rule": "Place both shapes on top of one another. Keep the combined silhouette and the visible outlines, but colour the result with the first shape’s colour.",
    "application": "Overlay the blue downward triangle and the yellow hexagon, then use blue for the combined figure. The triangle’s projecting tips remain visible around the hexagon.",
    "da": {
      "title": "Læg figurerne sammen og brug første farve",
      "rule": "Læg de to figurer oven på hinanden. Bevar den samlede silhuet og de synlige konturer, og brug den første figurs farve.",
      "application": "Læg den blå trekant og den gule sekskant sammen. Hele resultatet bliver blåt, og trekantens udstikkende spidser skal stadig kunne ses."
    }
  },
  "12": {
    "title": "Keep green in exactly one input",
    "rule": "Compare corresponding areas of the two squares. An area is green if it is green in exactly one input. Green in both cancels to white; white in both stays white.",
    "application": "The first square is entirely green and the second has only a green bottom-left quarter. That shared quarter turns white; the other three quarters stay green.",
    "da": {
      "title": "Bevar grønt fra præcis ét billede",
      "rule": "Sammenlign de samme områder i de to firkanter. Et område er grønt i resultatet, hvis det er grønt i præcis ét af billederne. Grønt i begge billeder bliver hvidt.",
      "application": "Første firkant er helt grøn; anden er kun grøn nederst til venstre. Det fælles grønne hjørne bliver hvidt, og de tre øvrige hjørner forbliver grønne."
    }
  },
  "13": {
    "title": "Attach a copy at every corner",
    "rule": "Put a copy of the small black symbol at each vertex of the large shape. The added copies take the large shape’s colour.",
    "application": "The large blue diamond has four corners. Add a blue downward triangle at each corner, following the same placement rule as the examples.",
    "da": {
      "title": "Sæt en kopi i hvert hjørne",
      "rule": "Anbring en kopi af det lille sorte symbol ved hvert hjørne af den store figur. Kopierne får den store figurs farve.",
      "application": "Den blå rombe har fire hjørner. Anbring en blå, nedadvendt trekant ved hvert hjørne på samme måde som i eksemplerne."
    }
  },
  "14": {
    "title": "Add corresponding bar heights",
    "rule": "For each of the three horizontal positions, add the black bar’s height in the first picture to its height in the second. Measure upwards from the common bottom line.",
    "application": "Neither input has a left bar. The two middle bars add to a full-height bar, while the right bars add to a shorter bar. The answer has just those middle and right bars.",
    "da": {
      "title": "Læg søjlernes højder sammen",
      "rule": "På hver af de tre pladser lægges søjlens højde i første billede sammen med højden i andet billede. Mål fra den fælles bundlinje.",
      "application": "Ingen af billederne har en venstre søjle. De midterste søjler giver tilsammen en søjle i fuld højde, mens de højre giver en kortere søjle."
    }
  },
  "15": {
    "title": "Rotate and alternate colours",
    "rule": "Turn the shape 45 degrees counterclockwise at each step. Its colour alternates, so the third picture returns to the first picture’s colour.",
    "application": "Turn the white middle shape another 45 degrees counterclockwise and restore the dark colour from the first picture. Choose the dark curved shape in that orientation.",
    "da": {
      "title": "Drej og skift farve",
      "rule": "Figuren drejes 45 grader mod uret for hvert trin. Farven skifter hver gang, så tredje billede har samme farve som det første.",
      "application": "Drej den hvide midterfigur endnu 45 grader mod uret, og brug den mørke farve fra første billede. Vælg den mørke, buede figur i denne retning."
    }
  },
  "16": {
    "title": "Combine the black circles",
    "rule": "A circle is black in the result whenever the matching circle is black in either input. It is white only when both inputs have a white circle there.",
    "application": "The first input contributes the bottom-right black circle; the second contributes the two top black circles. The centre and bottom-left circle stay white.",
    "da": {
      "title": "Kombinér de sorte cirkler",
      "rule": "En cirkel bliver sort i resultatet, hvis den tilsvarende cirkel er sort i mindst ét af de to billeder. Den er kun hvid, hvis begge billeder er hvide dér.",
      "application": "Første billede bidrager med den sorte cirkel nederst til højre, og andet med de to øverste. Cirklerne i midten og nederst til venstre forbliver hvide."
    }
  },
  "17": {
    "title": "Expand into neighbouring cells",
    "rule": "At each step, every blue cell remains blue and also colours its immediate neighbours above, below, left and right. Expansion stops at the grid boundary.",
    "application": "Apply the same one-cell expansion to the middle blue region. Newly reached side neighbours become blue; cells farther away remain in the grey-and-black checkerboard.",
    "da": {
      "title": "Udvid til nabofelterne",
      "rule": "Alle blå felter bevares og farver også deres nærmeste naboer oppe, nede, til venstre og til højre blå. Udvidelsen stopper ved kanten.",
      "application": "Udvid det blå område i midterbilledet med endnu ét nabofelt i hver retning. Felter længere væk beholder skakmønstret."
    }
  },
  "18": {
    "title": "Cancel matching brown positions",
    "rule": "Compare the two five-cell strips position by position. A cell is brown in the result if exactly one input is brown there. Matching brown cells cancel to blue.",
    "application": "Brown occurs in positions 2, 3, 4 and 5 in the first strip and in positions 2, 3 and 5 in the second. Only position 4 remains brown.",
    "da": {
      "title": "Fjern brunt på fælles pladser",
      "rule": "Sammenlign de to strimler plads for plads. En plads bliver brun, hvis den er brun i præcis én strimmel. Brunt i begge strimler bliver blåt.",
      "application": "Første strimmel er brun på plads 2, 3, 4 og 5; anden på plads 2, 3 og 5. Kun plads 4 forbliver brun."
    }
  },
  "19": {
    "title": "Remove the closest red dots",
    "rule": "Find the smallest distance between any two red dots. Remove every red dot belonging to a pair at that distance. Recalculate the closest distance for the next step.",
    "application": "In the middle picture, the three lower red dots participate in the closest diagonal pairs. Removing them leaves only the red dot in the top row, fourth column.",
    "da": {
      "title": "Fjern de nærmeste røde prikker",
      "rule": "Find den mindste afstand mellem to røde prikker. Fjern alle prikker, som indgår i et par med denne afstand. Find derefter den nye mindste afstand til næste trin.",
      "application": "De tre nederste røde prikker i midterbilledet indgår i de nærmeste diagonale par. Når de fjernes, er kun prikken i øverste række, fjerde kolonne tilbage."
    }
  },
  "20": {
    "title": "Move the six colours around a cycle",
    "rule": "Read down the left stack, then down the right stack. Shift every colour one position forward in that six-position cycle; the bottom-right colour wraps to the top left.",
    "application": "From the middle picture, the bottom-right brown circle wraps to the top left. The final stacks are brown/red/red on the left and black/brown/blue on the right.",
    "da": {
      "title": "Flyt farverne rundt i et kredsløb",
      "rule": "Læs først ned gennem venstre stak og derefter ned gennem højre. Flyt hver farve én plads frem i dette kredsløb. Farven nederst til højre fortsætter øverst til venstre.",
      "application": "Den brune cirkel nederst til højre flytter øverst til venstre. Resultatets venstre stak bliver brun, rød, rød, og højre stak bliver sort, brun, blå."
    }
  },
  "21": {
    "title": "Move white and black in opposite directions",
    "rule": "White circles move one corner clockwise and black circles move one corner counterclockwise at each step. Grey means that a white and a black circle occupy the same corner; separate them before moving again.",
    "application": "The middle picture contains white circles at the two left corners and black circles at the two left corners and bottom right. Moving them gives white at top left, grey at top right, and black at both bottom corners.",
    "da": {
      "title": "Flyt hvidt og sort hver sin vej",
      "rule": "Hvide cirkler flytter ét hjørne med uret, og sorte ét hjørne mod uret. Grå betyder, at hvidt og sort overlapper; flyt de to farver hver for sig i næste trin.",
      "application": "Midterbilledet har hvidt i de to venstre hjørner og sort i de to venstre samt nederst til højre. Efter flytningen bliver øverst til venstre hvidt, øverst til højre gråt og begge nederste hjørner sorte."
    }
  },
  "22": {
    "title": "Extend every horizontal stroke",
    "rule": "At each step, extend each black horizontal stroke into the immediately neighbouring capsule on both sides. Existing strokes remain, and strokes stop at the outside edges.",
    "application": "Extend the strokes in the middle picture one more capsule left and right. Keep separate stroke heights distinct; the answer shows the resulting longer horizontal lines across the four capsules.",
    "da": {
      "title": "Forlæng de vandrette streger",
      "rule": "Hver sort vandret streg forlænges til nabokapslen på begge sider. De eksisterende streger bevares, og forlængelsen stopper ved yderkanterne.",
      "application": "Forlæng midterbilledets streger endnu én kapsel til venstre og højre. Streger i forskellige højder skal fortsat være adskilte."
    }
  },
  "23": {
    "title": "Grow the triangular lattice",
    "rule": "Treat the drawing as a group of small triangles. At each step, add a small triangle just outside every exposed edge, keeping the existing triangles and their connecting lines.",
    "application": "Grow the middle green cluster by one more layer of neighbouring triangles. The answer keeps the same triangular grid and adds the triangles along its outside edges.",
    "da": {
      "title": "Udvid trekantgitteret",
      "rule": "Se figuren som en samling små trekanter. Tilføj en lille trekant uden på hver fri kant, mens de eksisterende trekanter og forbindelseslinjer bevares.",
      "application": "Udvid den grønne samling i midten med endnu ét lag nabotrekanter langs yderkanten. Bevar det samme trekantgitter."
    }
  },
  "24": {
    "title": "Remove the marked vertices",
    "rule": "The brown dots identify vertices of the black polygon to remove. Connect the remaining vertices in their original order. Two remaining vertices produce a line segment.",
    "application": "Remove the top and left vertices marked by the brown dots. Only the two lower vertices remain, so the answer is the short horizontal line near the bottom right.",
    "da": {
      "title": "Fjern de markerede hjørner",
      "rule": "De brune prikker markerer hjørner, der skal fjernes fra den sorte polygon. Forbind de resterende hjørner i deres oprindelige rækkefølge. To hjørner giver et linjestykke.",
      "application": "Fjern det øverste og venstre markerede hjørne. Kun de to nederste bliver tilbage, så svaret er den korte vandrette streg nederst til højre."
    }
  },
  "25": {
    "title": "Toggle the dots at the outline’s corners",
    "rule": "Match the black outline’s vertices to the 3-by-3 dot positions. At each vertex, remove an existing blue dot or add one if the position is empty. Other positions stay unchanged.",
    "application": "Toggle the four corner positions of the slanted outline. The result has blue dots at top left and top middle, middle middle and middle right, and all three bottom positions.",
    "da": {
      "title": "Skift prikkerne ved konturens hjørner",
      "rule": "Placér konturens hjørner på prikgitteret med tre rækker og tre kolonner. Ved hvert hjørne fjernes en blå prik, hvis der er en, og tilføjes en, hvis pladsen er tom.",
      "application": "Skift de fire pladser ved den skrå konturs hjørner. Resultatet har blå prikker øverst til venstre og i midten, i midterste rækkes midte og højre samt på alle tre nederste pladser."
    }
  },
  "26": {
    "title": "Remove the marked brick and its neighbours",
    "rule": "First remove the red brick and every brick sharing an edge with it, then let unsupported bricks fall straight down. Repeat the same process with the yellow brick.",
    "application": "After the red removal, the remaining bricks form the middle staircase. Removing the yellow brick and its touching neighbours leaves the upper blue brick, which falls to the bottom.",
    "da": {
      "title": "Fjern den markerede klods og dens naboer",
      "rule": "Fjern først den røde klods og alle klodser, der deler en kant med den. Lad klodser uden støtte falde lodret ned. Gentag med den gule klods.",
      "application": "Efter første fjernelse danner klodserne trappen i midten. Når den gule klods og dens kantnaboer fjernes, bliver den øverste blå klods tilbage og falder til bunden."
    }
  },
  "27": {
    "title": "Cycle the layers and apply the colour mask",
    "rule": "Track the same three shapes. At each step the front shape goes to the back. For the final picture, keep the middle picture’s grey or black fills; its unfilled white shapes regain their colours from the first picture.",
    "application": "The grey hexagon comes to the front, the black horizontal capsule lies behind it, and the vertical capsule moves to the back. That white vertical capsule regains its original yellow colour.",
    "da": {
      "title": "Flyt lagene og bevar farvemasken",
      "rule": "De samme tre figurer følges gennem rækken. For hvert trin flytter den forreste figur bagerst. I sidste billede bevares gråt og sort fra midterbilledet, mens hvide figurer får deres oprindelige farve tilbage.",
      "application": "Den grå sekskant kommer forrest med den sorte vandrette kapsel bagved. Den lodrette kapsel flytter bagerst og bliver gul igen."
    }
  },
  "28": {
    "title": "Use each circle’s colour to find its motion",
    "rule": "Track each circle relative to the circle immediately around it. White moves 90 degrees clockwise, black moves 90 degrees counterclockwise, and red stays in the same relative position. Blue does not move. Apply these movements to every nested level.",
    "application": "The black circle moves from above the blue circle to its left. Red stays to the right inside black. The larger white circle moves from above red to its right; the smallest white circle moves from below the larger white circle to its left.",
    "da": {
      "title": "Lad cirklens farve bestemme bevægelsen",
      "rule": "Følg hver cirkel i forhold til cirklen umiddelbart udenom. Hvid flytter 90 grader med uret, sort 90 grader mod uret, og rød bevarer sin relative placering. Blå flytter ikke. Gør det på alle niveauer.",
      "application": "Sort flytter fra over den blå cirkel til venstre for den. Rød bliver til højre inde i sort. Den store hvide flytter fra over rød til højre for den; den mindste hvide flytter fra under den store hvide til venstre for den."
    }
  },
  "29": {
    "title": "Move colours along the connected routes",
    "rule": "The black links specify the routes along which the colours move. Follow each loop clockwise, moving each colour to the next connected position. A two-position route swaps its colours; unconnected dots stay put.",
    "application": "Swap the two top colours. On the lower loop, the left-middle blue moves to the centre and the right-middle red moves to the bottom left. The unconnected bottom-right red stays unchanged.",
    "da": {
      "title": "Flyt farverne langs forbindelserne",
      "rule": "De sorte forbindelser viser farvernes ruter. Følg hver løkke med uret, og flyt hver farve til næste forbundne plads. To forbundne pladser bytter farve. Prikker uden forbindelse bliver stående.",
      "application": "Byt de to øverste farver. I den nederste løkke flytter blå fra venstre side til midten, og rød fra højre side til nederst til venstre. Den uforbundne røde prik nederst til højre bevares."
    }
  },
  "30": {
    "title": "Move each colour along its own path",
    "rule": "Red moves down, green moves right and yellow moves left. Blue moves up and, where possible, one column left. White marks overlapping colours; separate those colours again when applying the next move. Colours moving beyond the grid disappear.",
    "application": "Separate the middle white cell into red and green. Red moves to bottom middle, green to middle right, blue reaches top left and yellow exits on the left. Those three coloured cells form the answer.",
    "da": {
      "title": "Flyt hver farve ad sin egen rute",
      "rule": "Rød flytter ned, grøn til højre og gul til venstre. Blå flytter op og, hvor det er muligt, én kolonne til venstre. Hvid viser overlappende farver, som adskilles før næste flytning. Farver uden for gitteret forsvinder.",
      "application": "Adskil den hvide midtercelle i rød og grøn. Rød flytter til nederste midte, grøn til midterste højre, blå til øverste venstre, og gul forlader gitteret mod venstre."
    }
  },
  "31": {
    "title": "Move red and blue tips in opposite directions",
    "rule": "At each step, every red tip moves one position counterclockwise and every blue tip moves two positions clockwise around the five-pointed star. White means that red and blue overlap; separate both colours before moving again.",
    "application": "In the middle picture, red is at the lower right and blue is at the upper right and upper left. The next move puts red and one blue together at the upper right, making it white. The other blue moves to the lower left.",
    "da": {
      "title": "Flyt røde og blå spidser hver sin vej",
      "rule": "For hvert trin flytter røde spidser én plads mod uret og blå to pladser med uret rundt om stjernen. Hvid betyder overlap af rød og blå; flyt begge farver hver for sig i næste trin.",
      "application": "I midten er rød nederst til højre og blå øverst til højre og venstre. Næste trin samler rød og én blå øverst til højre, som bliver hvid. Den anden blå ender nederst til venstre."
    }
  },
  "32": {
    "title": "Shift two copies in the sector’s directions",
    "rule": "The two edges of the white sector indicate two movement directions. Make two copies of the red-dot pattern and shift one copy one grid step in each direction, wrapping at the edges. A position reached once is red; a position reached by both copies is blue.",
    "application": "The final sector points down-left and down-right. Shift a copy each way. Their overlap makes the entire top row and the centre blue; the single-copy positions remain red, as shown in the answer.",
    "da": {
      "title": "Forskyd to kopier i sektorens retninger",
      "rule": "Den hvide sektors to kanter viser to bevægelsesretninger. Lav to kopier af det røde prikmønster, og forskyd én kopi ét gittertrin i hver retning. Fortsæt rundt ved kanterne. Én kopi giver rødt; overlap af begge giver blåt.",
      "application": "Sidste sektor peger skråt ned mod venstre og højre. Forskyd en kopi hver vej. Overlappet gør hele øverste række og midten blå, mens de øvrige nåede pladser bliver røde."
    }
  },
  "33": {
    "title": "Remove crossing string segments",
    "rule": "Overlay both drawings. Treat each straight piece between successive grid dots as a separate string segment. When a segment from one drawing crosses a segment from the other between dots, remove both segments. Segments meeting at a grid dot stay. Keep all uncut segments from both drawings.",
    "application": "Remove the diagonal segments cut between the grid dots. The remaining pieces form an upper fork with a vertical stem, two detached short diagonals near the top corners, and a lower fork with its own vertical stem.",
    "da": {
      "title": "Fjern overklippede snorestykker",
      "rule": "Læg de to tegninger oven på hinanden. Hvert lige stykke mellem to naboprikker er et snorestykke. Når et stykke fra den ene tegning krydser et fra den anden mellem prikkerne, fjernes begge. Møder ved en prik bevares.",
      "application": "Fjern de diagonale stykker, der klippes mellem prikkerne. Resten danner en øvre og en nedre forgrening med lodrette stammer samt to korte, adskilte diagonaler nær de øverste hjørner."
    }
  },
  "34": {
    "title": "Slide and sort the pieces by size",
    "rule": "Push all pieces in the arrow’s direction. Smaller pieces pass larger pieces and reach the furthest available spaces first. Keep every piece’s height and vertical position. Pieces may share a column if they do not overlap vertically; equal-sized pieces keep their relative order.",
    "application": "The arrow points right. Fit the shortest pieces into the available spaces on the right, then the two-cell pieces, then the taller pieces to their left. Nothing moves up or down, and no piece changes size.",
    "da": {
      "title": "Skub og sortér brikkerne efter størrelse",
      "rule": "Skub alle brikker i pilens retning. Små brikker passerer store og når de yderste ledige pladser først. Højde og lodret placering bevares. Brikker kan dele kolonne uden lodret overlap. Lige høje brikker bevarer deres indbyrdes vandrette rækkefølge.",
      "application": "Pilen peger mod højre. Placér først de korteste brikker længst til højre, så brikkerne på to felter og derefter de højere brikker til venstre for dem. Ingen brik flytter op eller ned eller ændrer størrelse."
    }
  },
  "35": {
    "title": "Move the dividers into free spaces",
    "rule": "All black dividers simultaneously move one position to the right if the next position contains a yellow bead. A divider blocked by another divider waits. The right edge connects to the left edge.",
    "application": "Apply one simultaneous step to the middle sequence. The final order is divider, bead, divider, bead, divider, divider, bead.",
    "da": {
      "title": "Flyt stregerne til ledige pladser",
      "rule": "Alle sorte streger flytter samtidig én plads mod højre, hvis den næste plads indeholder en gul kugle. En streg med en anden streg foran sig venter. Højre kant fortsætter ved venstre kant.",
      "application": "Flyt én gang ud fra midterbilledets placeringer. Den sidste rækkefølge bliver streg, kugle, streg, kugle, streg, streg, kugle."
    }
  },
  "36": {
    "title": "Expand the colours and keep the largest group",
    "rule": "Replace every coloured ball with four new balls of the same colour, one step above, below, left and right. Balls leaving the grid disappear. At each position, keep the colour with the largest number of arriving balls. If colours tie for the largest number, leave the position empty. Several arrivals of the same colour appear as one coloured marker.",
    "application": "Expanding the displayed middle picture leaves green at the top right and at row 2, column 3; red at row 2, column 1; and brown at row 2, column 2, row 3, column 3, and row 4, columns 2, 3 and 4. Those are exactly the colours and positions in the stored answer.",
    "da": {
      "title": "Udvid farverne og bevar den største gruppe",
      "rule": "Erstat hver farvet kugle med fire nye i samme farve: én oppe, nede, til venstre og til højre. Kugler uden for gitteret forsvinder. På hver plads bevares den farve, flest kugler ankommer i. Ved lighed mellem de største grupper bliver pladsen tom.",
      "application": "Udvid midterbilledet. Grøn ender øverst til højre og i række 2, kolonne 3; rød i række 2, kolonne 1. Brun ender i række 2, kolonne 2, række 3, kolonne 3 og nederste rækkes kolonne 2, 3 og 4."
    }
  }
};
