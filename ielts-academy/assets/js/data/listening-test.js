/* =========================================================================
   Listening practice test — original IELTS-style material.
   Scripts are spoken with the browser's text-to-speech. [[…]] marks the
   words that carry an answer (highlighted in the transcript after marking).
   ========================================================================= */
/* Map for Part 2, questions 15–20 */
function westbrookMap() {
  const pin = (l, x, y) => `<g class="map-pin"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 4.5}" text-anchor="middle">${l}</text></g>`;
  return `<div class="map-wrap"><svg viewBox="0 0 600 440" role="img" aria-label="Map of Westbrook Heritage Park with places labelled A to H">
    <rect class="map-grass" x="20" y="20" width="560" height="380" rx="18"/>
    <ellipse class="map-wood" cx="130" cy="92" rx="105" ry="66"/>
    <text class="map-label" x="150" y="140">Woodland</text>
    <ellipse class="map-water" cx="430" cy="190" rx="95" ry="58"/>
    <text class="map-label" x="430" y="194" text-anchor="middle">Lake</text>
    <path class="map-path" d="M300,400 L300,62"/>
    <path class="map-path" d="M300,215 L80,215"/>
    <path class="map-path" d="M300,215 L313,206"/>
    <ellipse class="map-path" cx="430" cy="190" rx="118" ry="82" style="stroke-width:6"/>
    <circle class="map-feature" cx="300" cy="215" r="13"/><text class="map-label" x="318" y="244">Fountain</text>
    <rect class="map-feature" x="196" y="282" width="46" height="26" rx="4"/><text class="map-label" x="219" y="326" text-anchor="middle">Café</text>
    <rect fill="var(--paper)" x="276" y="392" width="48" height="12"/>
    <text class="map-label" x="300" y="428" text-anchor="middle" style="font-weight:800">▲ Main entrance</text>
    <g transform="translate(548 52)"><path d="M0,-18 L7,6 L0,1 L-7,6 Z" fill="var(--text)"/><text class="map-label" x="0" y="22" text-anchor="middle">N</text></g>
    <text class="map-label" x="572" y="250" text-anchor="end" style="font-size:10px">Westbrook Manor →</text>
    ${pin("A", 352, 352)}${pin("B", 248, 352)}${pin("C", 100, 70)}${pin("D", 58, 215)}
    ${pin("E", 430, 292)}${pin("F", 430, 86)}${pin("G", 560, 190)}${pin("H", 300, 46)}
  </svg></div>`;
}

window.LISTENING_TEST = {
  parts: [
    {
      id: 1,
      title: "Part 1 · Joining a leisure centre",
      scene: "A woman phones a leisure centre to ask about membership.",
      speakers: ["Tom (receptionist)", "Sarah (caller)"],
      lines: [
        [0, "Good morning, Riverside Leisure Centre, Tom speaking. How can I help you?"],
        [1, "Oh, hello. I'm thinking of joining the centre, and I wanted to find out about membership."],
        [0, "Of course. I can take a few details now and then explain the options. Could I have your name, please?"],
        [1, "Yes, it's Sarah Lindqvist."],
        [0, "And could you spell your surname for me?"],
        [1, "Sure. It's [[L, I, N, D, Q, V, I, S, T]]."],
        [0, "Thank you. And your address?"],
        [1, "It's 42 [[Thornbury]] Road. That's T, H, O, R, N, B, U, R, Y."],
        [0, "Lovely. And is there a phone number we can reach you on?"],
        [1, "My mobile is best. It's [[oh-seven-seven-oh-oh, nine-oh-oh, four-six-one]]."],
        [0, "Four-one-six at the end?"],
        [1, "No, four-six-one."],
        [0, "Got it. Now, what would you mainly be using the centre for?"],
        [1, "Well, I used to play tennis quite a lot, and I'd love to again, but a friend told me the courts here are always fully booked. So really it'll be [[swimming]], mostly. I try to do about thirty lengths a few times a week."],
        [0, "We have plenty of lane swimming sessions. Are you interested in any of the classes too? Some members like to combine the pool with a fitness class."],
        [1, "Yes, actually, the Pilates class. I saw on your website that there's one on Tuesday evenings."],
        [0, "There was, but I'm afraid that one's moved. It's on [[Thursday]] now, at seven."],
        [1, "Oh, that's fine. Thursday suits me better anyway."],
        [0, "Great. And can I ask how you heard about us? We like to keep track."],
        [1, "Hmm, I think I first saw an advert in the local paper, but I didn't really pay attention to it. It was my [[neighbour]] who persuaded me. She's been a member for years."],
        [0, "That's good to hear. Now, before you start, we need to know about any health issues. Is there anything that might affect your exercise?"],
        [1, "Well, I had a back problem a couple of years ago, but that's completely fine now. The only thing is my [[knee]]. I injured it skiing last winter, so I need to be a bit careful with running."],
        [0, "OK, I'll make a note, and the instructors can suggest some alternatives. Right, let me tell you about the membership options. Standard membership gives you the gym and the pool, but only at off-peak times."],
        [1, "How much is that?"],
        [0, "It used to be thirty-two pounds a month, but the price went up in January, so it's now [[thirty-four]] pounds."],
        [1, "And the other option?"],
        [0, "That's premium. It's forty-five pounds a month and includes all the facilities at any time, plus classes. You also get free [[parking]], which is useful because the car park normally costs two pounds a visit."],
        [1, "Oh, that is useful. Is there a joining fee?"],
        [0, "Normally it's twenty-five pounds, but we're not charging it for anyone who joins before the [[thirty-first of March]]."],
        [1, "Great, then I'd better make a decision soon! Thanks very much for your help."],
        [0, "You're welcome. Goodbye."],
      ],
    },
    {
      id: 2,
      title: "Part 2 · A guided tour of a park",
      scene: "A volunteer coordinator welcomes visitors to Westbrook Heritage Park.",
      speakers: ["Helen (guide)"],
      lines: [
        [0, "Good morning, everyone, and welcome to Westbrook Heritage Park. My name's Helen, and I'm one of the volunteer coordinators here. Before you set off to explore, I'd like to tell you a little about the park's history and some recent changes, and then I'll show you on the map where everything is."],
        [0, "Many visitors assume that the park was once the private garden of Westbrook Manor, the large house you can see just beyond the eastern fence. In fact, that's only partly true. For over two hundred years, this land was [[farmed. It supplied vegetables and fruit to the markets in the city]]. The manor family only bought it in 1890, and they opened it to the public thirty years later. As for the old story about soldiers training here during the war, I'm afraid there's no evidence for that at all."],
        [0, "Now, you may notice that the park looks rather different from a few years ago. The café, which has been here since the 1990s, was given a new roof last year, but the menu is the same. And we're hoping to build a children's play area next year, if we can raise the funds. But the biggest project by far, which was completed last spring, was the [[restoration of the lake]]. It had become so full of mud that in summer it was little more than a swamp. Now it's twice as deep, and the wildlife has returned."],
        [0, "That brings me to volunteering. We're very lucky to have plenty of people helping in the visitor centre, and our school visits are led by our two education officers, so we're fine there. Where we really need extra hands at the moment is in the woodland. The winter storms brought down a lot of trees, and the [[woodland paths need clearing and repairing]]. If you're interested, there's a sign-up sheet in the visitor centre."],
        [0, "And just a couple of requests. Dogs are welcome in all parts of the park, including the walled garden, as long as they're on a lead. You're also welcome to cycle on the main paths. What we do ask is that you [[don't feed the ducks and swans]] on the lake. Bread is very bad for them, and the leftovers pollute the water that we've just spent so much money cleaning."],
        [0, "Right, let's look at the map. We're standing at the main entrance, at the bottom of the map. As you come in, the [[visitor centre is the first building on your right]]. The toilets are opposite, on your left."],
        [0, "If you follow the main path straight ahead, you'll reach the fountain in the centre of the park. Turn left at the fountain and follow that path west. The [[walled garden is right at the end of that path]], on the western edge of the park. It's at its best in June, when the roses are out."],
        [0, "If you turn right at the fountain instead, the path takes you down to the lake. You'll come to the [[boathouse on the southern shore]], the side of the lake nearest to you. You can hire rowing boats there at weekends."],
        [0, "The [[picnic area is on the far side of the lake, on the northern shore]]. It's usually much quieter than the lawns near the café."],
        [0, "Keen birdwatchers should head for the bird hide. It's at the [[eastern tip of the lake]], right on the edge of the park, so you'll need to follow the lakeside path all the way round."],
        [0, "Finally, the sculpture trail. Lots of people expect it to start at the top of the main path, but that's where you'll find the old bandstand. The sculpture trail actually [[begins in the woodland in the north-west corner]] of the park, and it takes about forty minutes to walk."],
        [0, "OK, enjoy your visit, and do come and find me if you have any questions."],
      ],
    },
    {
      id: 3,
      title: "Part 3 · Discussing a research project",
      scene: "Two students, Maya and Leo, talk to their tutor, Dr Patel, about a project on household food waste.",
      speakers: ["Dr Patel (tutor)", "Maya (student)", "Leo (student)"],
      lines: [
        [0, "Come in, Maya, Leo. So, you wanted to talk about your food waste project before you start writing it up?"],
        [1, "Yes, thanks, Dr Patel. We've finished collecting the data, but we've had a few problems we wanted to discuss."],
        [0, "Go ahead. How did the survey go?"],
        [2, "Well, the response rate was actually better than we expected. We were hoping for about a hundred and fifty responses, and we got over two hundred."],
        [1, "And the survey was quick to do. Most people finished it in about five minutes, so nobody gave up halfway through. But there were two real issues. The first was question six."],
        [0, "Remind me what that was."],
        [1, "It asked people how much food waste they produced each week. But it turned out that some respondents included packaging, you know, plastic trays and boxes, and others didn't. So the question was [[ambiguous]], and the answers aren't really comparable."],
        [2, "And the other problem was technical. The [[online form crashed for two days]] in the second week, and we're fairly sure we lost some responses during that time."],
        [0, "Did you get a good spread of ages?"],
        [2, "We were worried we'd only get students, because we shared it on the university network first. But we also posted it on a local community page, and in the end the age groups were pretty evenly balanced."],
        [0, "Good. Now, about question six. What are you planning to do with that data?"],
        [1, "We wondered whether we should just leave it out completely."],
        [0, "I wouldn't do that. The data is still useful, and readers don't like to see results disappear. But it's too late to go back and re-interview people. My advice would be to [[present those results separately, with a clear note explaining the problem]] with the wording."],
        [1, "OK, that makes sense."],
        [0, "So what did you find? Anything unexpected?"],
        [2, "Well, I'd assumed that older people would waste less food than younger people, and that turned out to be true, so no surprise there. Maya thought families with children would be the worst, but they were about average. What really struck me was the food diaries. Most people [[thought they threw away about half of what they actually did]]. They seriously underestimated their own waste."],
        [0, "That's a very interesting finding, and it's consistent with other studies, too. And the interviews with the supermarket managers? How useful were those?"],
        [2, "I thought they were quite interesting, actually."],
        [1, "Really? I'm not sure. Honestly, I think we could have left them out. The managers [[just repeated what's already in their companies' published reports]], so we didn't learn anything new."],
        [0, "Well, you can mention them briefly. Now, you'll be presenting this to the department next month. Have you thought about the focus?"],
        [2, "We thought we'd spend quite a bit of time on the methodology, since we had those problems."],
        [0, "A little of that is fine, but audiences tend to lose interest in method fairly quickly. And you don't really have the data to compare your findings with other countries. What would make your presentation stand out is if you finished with some [[concrete recommendations for the local council]], things they could actually do to reduce waste."],
        [1, "Good idea. Could we also quickly go through our sources? We've got four main ones."],
        [0, "Sure."],
        [1, "First, the government report on household waste. It's very long and pretty dry."],
        [2, "But the statistics in it are the most reliable we have. I suggest we [[just use the figures]] from it and not worry about the rest."],
        [0, "Agreed."],
        [1, "Then there's the newspaper article about supermarkets throwing away food."],
        [2, "It's very emotional, and it doesn't cite any sources at all."],
        [1, "True. Let's [[not include it]]."],
        [0, "I think that's wise."],
        [2, "Then there's the 2015 university study. It's quite old now."],
        [1, "But it's the study that really started the public debate. We could [[mention it at the start, as background]], but not use it in our analysis."],
        [0, "Yes, that's a good way to use it."],
        [1, "And finally, the charity's website. Their figures are much higher than everyone else's."],
        [2, "They might be right, though. They do a lot of research."],
        [0, "Possibly, but I'd [[compare their figures with the government data]] before you rely on them."],
        [1, "OK. Thanks, Dr Patel, that's really helpful."],
      ],
    },
    {
      id: 4,
      title: "Part 4 · Lecture: green roofs",
      scene: "A lecture on green roofs in cities.",
      speakers: ["Lecturer"],
      lines: [
        [0, "Good afternoon. Today I'm going to talk about green roofs, roofs that are partly or completely covered with plants, and why so many cities are now encouraging them."],
        [0, "Let's begin with what a green roof actually is. It's not simply a few plant pots on top of a building. A green roof is a system of layers. At the bottom there's a waterproof [[membrane]], which protects the building from water damage. Above that there are layers for drainage and filtering, then the growing medium, a kind of lightweight soil, and finally the plants themselves."],
        [0, "People have, of course, grown plants on roofs for thousands of years. The famous turf roofs of Scandinavia are a good example. But the modern green roof, with its engineered layers, was developed in [[Germany]] in the 1960s, and German cities still have more green roof area than almost anywhere else."],
        [0, "There are two main types. Extensive green roofs have a very shallow layer of soil, often less than fifteen centimetres. They're planted with tough, low-growing species that need very little water. [[Sedum]] is the most common choice. That's S, E, D, U, M. Extensive roofs are light and fairly cheap. Intensive green roofs, on the other hand, have much deeper soil, so they can support shrubs and even small trees, and people can use them like a park. The drawback is that they need a great deal more [[maintenance]], watering, weeding and so on, which makes them expensive to run."],
        [0, "So why are cities interested? The first reason is water. In a city, most surfaces are hard, so when it rains heavily, water runs straight into the drains, which can't cope. A green roof absorbs much of that rain and releases it slowly, which reduces the risk of [[flooding]]."],
        [0, "Secondly, green roofs insulate the building. You might expect the main benefit to be in winter, but in fact the effect on heating is quite small. The real saving is in summer, when a green roof can significantly reduce the energy needed for [[cooling]]."],
        [0, "Thirdly, there's biodiversity. Green roofs provide a habitat for [[insects]], bees in particular, which have lost much of their habitat in urban areas, and these in turn attract birds."],
        [0, "Finally, green roofs help to reduce what's called the urban heat island effect, the fact that cities are warmer than the surrounding countryside. On a hot summer day, the surface of a conventional dark roof can reach over seventy degrees Celsius. A green roof's surface can be up to [[forty]] degrees cooler."],
        [0, "Now, there are some challenges. Installation is expensive, although costs are falling. But for building owners, the main concern is usually not cost but [[weight]]. Soil, plants and especially water are heavy, so many older buildings simply can't support a green roof without structural work."],
        [0, "Despite this, more and more cities are taking action. In 2009, Toronto became the first city in North America to make green roofs [[compulsory]] on large new buildings, and many cities in Europe and Asia have introduced similar rules or offer financial incentives. In the next lecture, we'll look at how green roofs are designed for different climates."],
      ],
    },
  ],

  /* ------------------------------------------------ Questions */
  groups: [
    {
      part: 1,
      title: "Part 1 · Questions 1–7",
      instr: "Complete the form below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
      notes: "RIVERSIDE LEISURE CENTRE — Membership enquiry",
      questions: [
        { n: 1, type: "gap", text: "Name: Sarah {}", answer: ["Lindqvist"], why: "The surname is spelled letter by letter. Spelling mistakes = wrong answer, so practise the alphabet (especially Q, V, I/E, G/J)." },
        { n: 2, type: "gap", text: "Address: 42 {} Road", answer: ["Thornbury"], why: "Spelled out as T-H-O-R-N-B-U-R-Y. Don't write “Road” again — it is already on the form." },
        { n: 3, type: "gap", text: "Mobile number: {}", answer: ["07700900461", "07700 900461"], why: "British speakers say “oh” for 0. The receptionist's “four-one-six” is a <i>distractor</i>: Sarah corrects it to four-six-one." },
        { n: 4, type: "gap", text: "Main activity: {}", answer: ["swimming", "swim"], why: "Tennis is mentioned first, but the courts are always booked — “So really it'll be swimming, mostly.”" },
        { n: 5, type: "gap", text: "Class: Pilates on {} at 7 pm", answer: ["Thursday", "Thursdays"], why: "Classic correction trap: Tuesday was the old day; “It's on Thursday now.”" },
        { n: 6, type: "gap", text: "Heard about the centre from: her {}", answer: ["neighbour", "neighbor"], why: "The newspaper advert is a distractor (“I didn't really pay attention to it”). “It was my neighbour who persuaded me.”" },
        { n: 7, type: "gap", text: "Health: injured {} — be careful with running", answer: ["knee"], why: "The back problem is “completely fine now” — only the knee is current." },
      ],
    },
    {
      part: 1,
      title: "Part 1 · Questions 8–10",
      instr: "Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.",
      notes: "Membership options",
      questions: [
        { n: 8, type: "gap", text: "Standard (off-peak gym and pool): £{} per month", answer: ["34", "thirty-four", "thirty four"], why: "£32 was the old price; “it's now thirty-four pounds.”" },
        { n: 9, type: "gap", text: "Premium (£45): all facilities and classes, plus free {}", answer: ["parking"], why: "“You also get free parking.” The £2 is what the car park normally costs." },
        { n: 10, type: "gap", text: "No joining fee for anyone who joins before {}", answer: ["31 March", "31st March", "March 31", "March 31st", "31st of March", "thirty-first of March", "31/3", "31.3"], why: "“…anyone who joins before the thirty-first of March.” Any clear date format is accepted." },
      ],
    },
    {
      part: 2,
      title: "Part 2 · Questions 11–14",
      instr: "Choose the correct letter, <b>A, B or C</b>.",
      questions: [
        { n: 11, type: "mcq", text: "Before 1890, the land where the park is now was used", options: [["A", "as a private garden for the manor."], ["B", "for training soldiers."], ["C", "for producing food for the city."]], answer: "C", why: "“This land was farmed. It supplied vegetables and fruit to the markets in the city.” Both A and B are mentioned only to be rejected." },
        { n: 12, type: "mcq", text: "The most significant recent change to the park has been", options: [["A", "the improvement of the café."], ["B", "the work on the lake."], ["C", "the creation of a play area."]], answer: "B", why: "“The biggest project by far… was the restoration of the lake.” The play area hasn't been built yet (future)." },
        { n: 13, type: "mcq", text: "Volunteers are currently most needed to", options: [["A", "help in the visitor centre."], ["B", "lead school groups."], ["C", "repair paths through the trees."]], answer: "C", why: "Paraphrase: “woodland paths need clearing and repairing” = repair paths through the trees." },
        { n: 14, type: "mcq", text: "Visitors are asked not to", options: [["A", "take dogs into the walled garden."], ["B", "give food to birds on the lake."], ["C", "ride bicycles on the main paths."]], answer: "B", why: "“Don't feed the ducks and swans” = give food to birds. Dogs and cycling on main paths are allowed." },
      ],
    },
    {
      part: 2,
      title: "Part 2 · Questions 15–20",
      instr: "Label the map below. Choose the correct letter, <b>A–H</b>, for each place.",
      context: westbrookMap(),
      questions: [
        { n: 15, type: "select", text: "Visitor centre {}", options: ["A", "B", "C", "D", "E", "F", "G", "H"], answer: "A", why: "“The first building on your right” as you come in from the entrance (B, on the left, is the toilets)." },
        { n: 16, type: "select", text: "Walled garden {}", options: ["A", "B", "C", "D", "E", "F", "G", "H"], answer: "D", why: "Left at the fountain, follow the path west — it's at the end, on the western edge." },
        { n: 17, type: "select", text: "Boathouse {}", options: ["A", "B", "C", "D", "E", "F", "G", "H"], answer: "E", why: "Right at the fountain to the lake; boathouse on the southern shore (the side nearest the entrance)." },
        { n: 18, type: "select", text: "Picnic area {}", options: ["A", "B", "C", "D", "E", "F", "G", "H"], answer: "F", why: "“On the far side of the lake, on the northern shore.”" },
        { n: 19, type: "select", text: "Bird hide {}", options: ["A", "B", "C", "D", "E", "F", "G", "H"], answer: "G", why: "“At the eastern tip of the lake, right on the edge of the park.”" },
        { n: 20, type: "select", text: "Start of the sculpture trail {}", options: ["A", "B", "C", "D", "E", "F", "G", "H"], answer: "C", why: "Distractor: H (top of the main path) is the bandstand. The trail begins in the north-west woodland." },
      ],
    },
    {
      part: 3,
      title: "Part 3 · Questions 21–22",
      instr: "Choose <b>TWO</b> letters, A–E.",
      questions: [
        {
          n: [21, 22], type: "multi", text: "Which TWO problems did the students have with their survey?",
          options: [["A", "Not enough people responded."], ["B", "One question could be understood in different ways."], ["C", "It took too long for people to complete."], ["D", "Most respondents were from the same age group."], ["E", "Some responses were lost because of a technical fault."]],
          answer: ["B", "E"], why: "B = question six was “ambiguous”; E = “the online form crashed… we lost some responses”. A, C and D are all mentioned but contradicted (200+ responses, five minutes, ages balanced).",
        },
      ],
    },
    {
      part: 3,
      title: "Part 3 · Questions 23–26",
      instr: "Choose the correct letter, <b>A, B or C</b>.",
      questions: [
        { n: 23, type: "mcq", text: "What does Dr Patel advise them to do with the data from question 6?", options: [["A", "leave it out of the analysis"], ["B", "show it separately with an explanation"], ["C", "collect it again through interviews"]], answer: "B", why: "“Present those results separately, with a clear note explaining the problem.” She rejects A (“I wouldn't do that”) and C (“too late”)." },
        { n: 24, type: "mcq", text: "What did Leo find most surprising?", options: [["A", "Older people wasted less than younger people."], ["B", "Families with children wasted an average amount."], ["C", "People believed they wasted less than they really did."]], answer: "C", why: "A was expected (“no surprise there”); B was Maya's expectation. “What really struck me” signals the answer: people underestimated their waste." },
        { n: 25, type: "mcq", text: "What is Maya's opinion of the supermarket interviews?", options: [["A", "They were the most useful part of the research."], ["B", "They should have been carried out earlier."], ["C", "They did not provide new information."]], answer: "C", why: "Careful with WHO says what: Leo liked them, but Maya says the managers “just repeated what's already in their published reports”." },
        { n: 26, type: "mcq", text: "Dr Patel thinks the presentation should end with", options: [["A", "suggestions for local government."], ["B", "a discussion of the research method."], ["C", "a comparison with other countries."]], answer: "A", why: "“Concrete recommendations for the local council” = suggestions for local government." },
      ],
    },
    {
      part: 3,
      title: "Part 3 · Questions 27–30",
      instr: "What do the students decide to do with each of the following sources? Choose <b>FOUR</b> answers from the box and write the correct letter, <b>A–E</b>.",
      box: { title: "Decisions", items: [["A", "use it as the main source of evidence"], ["B", "use only the statistics from it"], ["C", "check its information against another source"], ["D", "not use it at all"], ["E", "refer to it only in the introduction"]] },
      questions: [
        { n: 27, type: "select", text: "the government report {}", answer: "B", why: "“Just use the figures from it and not worry about the rest.”" },
        { n: 28, type: "select", text: "the newspaper article {}", answer: "D", why: "“Let's not include it.”" },
        { n: 29, type: "select", text: "the 2015 university study {}", answer: "E", why: "“Mention it at the start, as background” = refer to it only in the introduction." },
        { n: 30, type: "select", text: "the charity's website {}", answer: "C", why: "“Compare their figures with the government data before you rely on them.” Option A is never chosen." },
      ],
    },
    {
      part: 4,
      title: "Part 4 · Questions 31–40",
      instr: "Complete the notes below. Write <b>ONE WORD ONLY</b> for each answer.",
      notes: "GREEN ROOFS",
      questions: [
        { n: 31, type: "gap", text: "<b>Structure</b> — bottom layer: a waterproof {}", answer: ["membrane"], why: "“At the bottom there's a waterproof membrane.”" },
        { n: 32, type: "gap", text: "Modern engineered design developed in {} in the 1960s", answer: ["Germany"], why: "Scandinavia (turf roofs) is the older tradition — a distractor." },
        { n: 33, type: "gap", text: "<b>Extensive</b> — shallow soil; plants such as {} that need little water", answer: ["sedum"], why: "Spelled S-E-D-U-M. Unfamiliar words in Part 4 are almost always spelled for you." },
        { n: 34, type: "gap", text: "<b>Intensive</b> — deep soil, can support small trees, but need much more {}", answer: ["maintenance"], why: "“They need a great deal more maintenance.” Watch the spelling: main-te-nance, not maintainance." },
        { n: 35, type: "gap", text: "<b>Benefits</b> — absorb rain, reducing the risk of {}", answer: ["flooding", "floods"], why: "“…which reduces the risk of flooding.”" },
        { n: 36, type: "gap", text: "Insulation: biggest energy saving is on {} in summer", answer: ["cooling"], why: "Heating is the distractor — “the effect on heating is quite small”." },
        { n: 37, type: "gap", text: "Provide a habitat for {}, e.g. bees", answer: ["insects"], why: "“A habitat for insects, bees in particular.” Birds come later as a result, not the answer." },
        { n: 38, type: "gap", text: "Surface can be up to {} degrees cooler than a normal roof", answer: ["40", "forty"], why: "Seventy degrees is the temperature of a dark roof — a number distractor." },
        { n: 39, type: "gap", text: "<b>Challenges</b> — owners' main concern is the {} of the roof", answer: ["weight"], why: "“The main concern is usually not cost but weight.” — cost is mentioned first to trap you." },
        { n: 40, type: "gap", text: "Toronto (2009): green roofs made {} on large new buildings", answer: ["compulsory", "mandatory", "obligatory", "required"], why: "“Make green roofs compulsory.”" },
      ],
    },
  ],
};
