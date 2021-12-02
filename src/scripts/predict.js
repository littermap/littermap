// module.exports.getWeights = getWeights; // add when unit testing
// module.exports.readTagWeights = readTagWeights; // add when unit testing
// module.exports.calculateWeights = calculateWeights; // add when unit testing

// export default // remove when unit testing
export default async function getWeights(x1, y1, x2, y2, timeout, r, c) {

    // TODO figure out what the radius is (since if it's too large, the API call won't work)
    let rad = 0; rad /= 5280; // Size of the largest radius in the spreadsheet (in feet)
    
    let tagWeights = readTagWeights();
    let nodes = await fetch(`https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:${timeout}][bbox:${y2 - rad},${x1 - rad},${y1 + rad},${x2 + rad}];node(if:count_tags()%20%3E%200);out%20meta;`)
    .then(response => response.json()).then(data => data.elements); 

    // Create flattened matrix to store tag frequencies for each grid cell
    let tagMatrix = []; // tagMatrix[0] = (x1, y1) = top-left
    if(r == null || r < 1){ r = 20; } r += 2 * Math.ceil(rad / ((y1 - y2) / r));
    if(c == null || c < 1){ c = 20; } c += 2 * Math.ceil(rad / ((x2 - x1) / r));
    for(let i = r * c; i > 0; i--){
        tagMatrix.push(new Map());
    }
    let weightR = r;
    let weightC = c;
    
    // Take each node and assign its tags to the corresponding grid cell
    for(let node of nodes){
        let cell = tagMatrix[Math.floor((y1 - node.lat) / ((y1 - y2) / r)) * c + Math.floor((node.lon - x1) / ((x2 - x1) / c))];
        // Take the tags and add them to a map (which stores each tag and its frequency)
        for(let property in node.tags){
            let key = property + ":" + node.tags[property]; // {[property]: node.tags[property]}; // Object equality checks are difficult
            cell.set(key, (cell.has(key) ? cell.get(key) : 0) + 1);
        }
    }

    // Call the algorithm to find the weight of each cell
    return calculateWeights(tagWeights, tagMatrix, r, c, weightR, weightC);
};

function readTagWeights() {
    let csv = `Simple Distance/Simple Buffer Proximity Factors,,,,,
    code,feature,info,open streets map tag,radius to make the buffer,required number of tags of other factors to exist within .25 mile for this buffer to become visible
    24 ,24 hour business,"source of disposable waste, and convening place for late night crowds",opening_hours=24/7,120,7
    aba,abandoned anything,indicative of disregard,abandoned=yes,200,4
    aba,abandoned anything tag,indicative of disregard,status=abandoned,200,4
    aba,abandoned train tracks,"typical to inner city areas that want to reduce rail traffic, they become walking paths that do not have oversight","railway=abandoned, railway=disused, disused:railway=*",200,4
    abc,abc store,source of disposable waste that at times needs to be hidden from others due to alcoholism problems,shop=alcohol,60,3
    abu,abutters,"these are apartments, boundries between apartments usually become paths to and from them leading to small trails and lots of litter",abutters=residential,70,12
    all,allotments,small apartments can be a factor if in proximity to other factors,place=allotments,50,14
    apa,apartments (low income),apartment general tag that can be combined with condition tags or proximity to other apartments to indicate littering,"building=residential, residential=apartments",200,6
    art,artificial waterway,"built in cities to direct water away from buildings, they carry litter from streets to natural areas",waterway=artificial,100,3
    bad,bad condition,things in poor condition can contribute to apathy about them,condition=fair,150,4
    bad,bad condition also,things in poor condition can contribute to apathy about them,condition=deficient,150,4
    bar,bar,nightlife in conjuction with other factors can indicate a more difficult area to maintain cleanliness,"amenity=bar, amenity=pub",60,6
    bar,barbed wire fence,"usually constructed to protect from illegal behavior, littering is an illegal behavior that can correspond",fence_type=barbed_wire,30,8
    bea,beach,"beaches experience littering, but they also can be locations for litter to be deposited from the water. identifying so called depositing beaches is very valuble and would require data from currents and wind, but it could give a hugely valuble insight if done correctly. see Kamilo beach Hawaii for an example. some beaches receive enormous amounts of plastic from the ocean due to currents. ",natural=beach,20,5
    bea,beach or lake,"coastline is an appropriate tag for this prediction. there is an interesting effect on shorelines of lakes. if you are familiar with what a bathtub ring is, it is where dirt and silt will form at the water level of the bathtub after bathing a dirty person or dog for instance. Lakes form a ring around the shoreline in this same way. The ring is due to floating plastic being picked up during the rainy/wet/winter season, and it ends up in lakes where wind blows it to the shore. Once at the shore, when the water level receeds it gets deposited on the shore. As an example, a few different volunteer groups in durham, us included, have removed over 1000 trash bags full of plastic from shorelines at Falls lake, and the same is true for Jordan lake.",natural=coastline,60,0
    bic,bicycle allowed,smaller factor but walkability and bikeability contribute to littering because they indicate closer proximity to all other factors,bicycle=permissive,15,12
    bic,bicycle parking,smaller factor but walkability and bikeability contribute to littering because they indicate closer proximity to all other factors,"amenity=bicycle_parking, bicycle_parking=stands",15,12
    bic,bicycle road,"this is a tag for paved paths meant for bicycle riding/walking, they are vulnerable to littering when combined with other factors.",bicycle_road=yes,15,8
    bie,biergarten,this is a large outdoor bar that contributes to foot traffic and source for litter,amenity=biergarten,120,5
    bik,bike rack,bicycling community can be a contributor as before,bicycle_parking=rack,20,12
    bik,bike route,bicycling community can be a contributor as before,route=bicycle,15,12
    boa,boardwalk,"litter doesnt usually stay on the boardwalk, but intersections with waterways, other factors and more can be locations for litter",bridge=boardwalk,40,8
    boa,boat launch,"many boat launches are these 24 hour unmaintained areas on lakes sometimes under the ""maintainance"" of over worked and under staffed commisions like the fish and wildlife department. They are also places where people spend leisure time but there is not the kind of maintainence you would find at more expensive places to vacation/visit like a resort, etc.",leisure=slipway,40,2
    boy,boys and girls club,this particular community development center has unfortunately been an indicator for littering nearby. I have found a lot of litter nearby these locations in diffent cities/areas.,landuse=recreation_ground,400,4
    bui,building ruins,disused places can be congregating place for people who litter,building=ruins,200,4
    bus,bus route,"bus stops have always been locations I have found litter. sometimes it is not directly at the stop, but down some little trail at the bus stop or nearby",route=bus,100,60
    bus,bus station,bus stations can be a contributing factor,public_transport=station,40,24
    bus,bus station,bus stations can be a contributing factor,amenity=bus_station,40,24
    bus,bus stop,"bus stops have always been locations I have found litter. sometimes it is not directly at the stop, but down some little trail at the bus stop or nearby","public_transport=stop_position, shelter=yes, ",50,6
    bus,bus stop shelter,bus stop with shelters are sometime hangouts where people litter,shelter_type=public_transport,50,6
    cam,camp pitch,believe this tag applies to homeless tents as well which is always a probability factor in littering nearby,tourism=camp_pitch,40,3
    cam,camp site,believe this tag applies to homeless tents as well which is always a probability factor in littering nearby,tourism=campsite,40,6
    cam,camper trailers,this tag refers to mobile homes as we know them. in my experience there is more likely litter around these than other residential areas,caravans=yes,80,6
    cha,chain link fence,a cheaper fence and a factor if you combine it with other factors,fence_type=chain_link,50,8
    cig,cigarette vending machine,these are not found here but they are a definite source of litter in other places,vending=cigarette,40,3
    cit,city,i find litter that comes from human sources more frequently in populated areas. the accumulation of litter in nature comes from human sources and ends up there because of water travel.,place=city,10,400
    cit,city block,a city block with other tags or factors nearby could be a very beneficial tag to create a buffer around,place=city_block,120,25
    cit,city border,usually lower income,border_type=city,400,30
    cit,city with taxis,higher population ,"place=city, taxi=yes",400,400
    civ,civic,these buildings include community development centers which are usually put nearby neighborhoods that need some improvement not excuding litter cleanup,building=civic,100,20
    cla,clay road,less well maintained roads can be places for dumping. ,surface=clay,60,24
    cle,cleanup location,in the future maping these locations will contribute to indentifying other places nearby that have pollution problems,(not on OSM),100,0
    clo,clock,,amenity=clock,50,300
    clo,closed,closed businesses also indicate a lapse in maintenance of nearby public service workers their properties are vulnerable to littering and they indicate a general area that has a littering problem,operational_status=closed,120,20
    col,collapsed building,disregard for visual asthetic can be a place where there is also littering,building=colapsed,400,20
    com,common/town commons,congregating place for people who could potentially litter,leisure=-common,400,12
    com,community development center,,"amenity=community_centre, amenity=social_facility",80,0
    con,construction,,construction=residential,60,12
    con,convenience store,source of disposable waste,shop=convenience,120,12
    cyc,cycleway opposite traffic,this is technically a one way road with two way bike lanes they are akin in some places to alleys. alleys tend to collect litter.,cycleway=opposite,60,3
    dam,dam,water from lakes and rivers carry plastic to dams where it is blocked from going further. many dam operators have to clean out the collection of trash/debris to maintain the function of the dam.,waterway=dam,60,0
    dam,damaged building,disrepair can be associated with worse condition of neighborhood and littering,building=damaged,120,
    dec,deciduous forest,"this is actually not a proximity tag per say, but it is easier to see pollution in areas that drop leaves in the fall. Usually when all the vegitation dies littering is more visible.","leaf_cycle=semi_deciduous,leaf_cycle=mixed, wood=deciduous",,
    dem,demolished railway,this can indicate a walking path as mentioned before,railway=razed,200,5
    dep,department store,"big box stores such as walmart and other low cost department stores tend to have litter off the edge of their parking lots. indeed, we have cleaned up litter around many of the walmarts in the area, and even out of state, it seems to be a universal phenomenon. ",shop=department store,120,3
    dis,disused,"this tag is for anything not in use, so likely to contribute to littering",disused=yes,120,2
    dog,dog excrement,"this tag if a waste bin for dog excrement, I thought the tag was for actual dog waste at first, but I think non the less proximity to parks and areas where people can dispose of pet waste could be a factor when combined with other factors",waste=dog_excrement,30,4
    dow,downtown trees,"a wooded area near downtown areas are havens for people who litter/hangout and drink this tag could use some logic itself, because it really only applies to wooded areas within cities or towns. ",tree_form=natural,80,3
    dri,drive through other,drive through food places are notorious sources for disposable packaging,drive_through=yes,60,0
    dum,dump,nearby dumps are places that cities and towns care less about and do not maintain as well. unforntunately the roads nearby dumps are typically littered more than say a nice commercial area.,amenity=waste_disposal,600,3
    dyk,dyke,this is a drainage ditch. trash will end up here after rain,man_made=dyke,30,6
    ele,elevation,a negative elevation tag can be indicative of places where trash flows,elevation=-3,50,30
    ent,entrance national park,"this tag is not the best, but parking locations for entering state and national parks can be locations for trash",boundary=national_park,60,
    eph,ephemeral,"ephemeral is a tag which means temporary, it can be applied to fair grounds, festivals, constructions sites, etc, and they can be locations of litter",ephemeral=yes,80,10
    exi,exit with shoulder,truckers love to pull over on the shoulder of an exit and dispose of their trash there including bottles of piss and motor oil in containers that can be heavily polluting. if litter is found on a certain highway you can be sure that exits where people can pull over with have more litter.,"exit=yes, shoulder=yes",60,0
    ext,extended stay hotel,,,60,0
    fas,fast food,huge sources of disposable waste,"amenity=fast_food, cuisine=burger",60,0
    fis,fish and wildlife entrance,,,70,0
    fis,fishing spot,fishing spots are largely operated by fish and wildlife departments and they have no maintenance. Many times these places collect litter from people who expect there is someone who is in charge of cleaning them up/less expensive forms of leisure like fishing are usually enjoyed by those who are more likely to litter. it has been studied that people who live in more affluent places and tend to visit more expensive venues to litter are likely more educated about environmental issues. ,leisure=fishing,70,0
    flo,flood plain below populated,"if there is a way to correlate these areas with proximity to  populated areas, flood plains always collect litter. after tropical storm michael a few years ago we cleaned up many local floodplains with hundreds of bag of litter. ","wetland=swamp, wetland=marsh, ",1000,0
    flo,flood prone near populated,"if there is a way to correlate these areas with proximity to  populated areas, flood plains always collect litter. after tropical storm michael a few years ago we cleaned up many local floodplains with hundreds of bag of litter. ",flood_prone=yes,200,0
    flo,flooded tunnel,"honestly dont know exactly what this tag refers to, but if it is related to water flow from populated areas it would be a factor.",tunnel=flooded,60,not sure
    foo,food court,"in other countries this tag can be used for a square or promenade that has lots of places to eat on it, they are locations for littering that disposable waste",amenity=food_court,100,14
    foo,food pantry,unfortunately the people who make use of food banks have typically been more likely to litter in my experience. The areas around food banks are typically lower income and more litter prone.,social_facility=food_bank,120,6
    foo,foot route,walking paths are sources for litter when combined with other factors,"route=foot, motorroad=no",80,3
    fre,free parking,this is an attribution tag that can be used in connection with the other parking tag. free parking usually does not have an attendant that can be in charge of litter cleanup.,fee=no,50,12
    gas,gas station,"can be source of disposable waste and a destination of foot traffic as well. I usually find litter off in the woods off a gas station, in an alley behind them, or just on roads nearby them.",amenity=fuel,60,1
    gaz,gazebo ,places people congregate.,amenity=shelter,30,0
    gra,graffiti,can indicate littering (not street art) if it is taken into account with other factors,"artwork_type=street_art, artwork_type:street_art=graffiti",30,14
    gro,grocery store,"huge sources of disposable waste. the grocery stores where people are able to walk there are especially predisposed. see edges of parking lots, behind them, and other areas. ","shop=grocery, shop=supermarket",60,8
    gro,groyne,this tag is something water related I think its a retention pond. I cant remember but I found it indicative.,man_made=groyne,30,0
    hig,highway exit with shoulder,truckers love to pull over on the shoulder of an exit and dispose of their trash there including bottles of piss and motor oil in containers that can be heavily polluting. if litter is found on a certain highway you can be sure that exits where people can pull over with have more litter.,"highway=motorway_junction, shoulder=yes",60,0
    hig,highway rest area,can be place where trash from the car is disposed improperly,highway=rest_area,60,4
    his,historic railroad,these are typically walking paths,historic=railway,80,0
    hom,homeless encampment,homelessness usually involves mental illness and people with those disabilities tend to litter their surroundings,tents=yes,100,0
    hos,hostel,"hostels are inexpensive hotels, in my experience they can be locations nearby litter/pollution problems",tourism=hostel,80,6
    ice,icecream,this is a very small correlation ,amenity=ice_cream,0,0
    imp,impassible roads,indicates poor city maintenance includes litter removal,smoothness=impassable,60,6
    ine,inexpensive hotel,motels are less expensive and more likely to see litter,"tourism=motel, tourism=hotel, building=hotel",120,0
    isl,island,if an island is in a lake then its likely that little can accumulate there,place=island,0,0
    kio,kiosk,kiosks in this tag refer to open air businesses in promenades and other similar places. they are in close proximity to businesses that can be a source of litter.,shop=kiosk,40,20
    lan,landfill,,landuse=landfill,800,4
    lau,laundry ,"laundry mats usually exist in lower income areas, and I have found litter around them",shop=laundry,300,16
    low,low income neighborhood,not sure what tag to add to this to select only low income neighborhoods. ,place=neighborhood,400,20
    low,low standing,this standing tag I believe is similar to the condition tag,standing=very_low,400,4
    mar,marketplace,marketplaces are open air shopping places that see a lot of foot traffic and can be potential sites of littering,amenity=marketplace,300,
    mas,massage parlor,"the low end type of massage parlors seen in the american south are sometimes are used to other purposes, and they generally reside in low income areas that are more susceptable to litter.",shop=massage,100,36
    mcd,mcdonalds,huge source of disposable waste,brand=mcdonalds,80,0
    med,medium bridge,"not sure how to include the medium size factor, but bridges are places that are used by transients to sometimes congregate under or live under, and they can be a risk factor for littering in the area",man_made=bridge,60,6
    min,minor construction ,this tag is included because it could potentially helpful. I need to look at some places tagged with this to see what exactly minor construction refers to.,construction=minor,60,30
    mis,misc outdoor seating,outdoor seating is a place where trash from the business can be disposed into the environment or it generally contributes to the likelihood that people in the area spend time outdoors there. the more time they spend out doors the more chance their waste goes into the environemnt rather than a proper disposal bin.,leisure=outdoor_seating,80,16
    mob,mobile home park,"mobile home parks have historically been for me sites of more litter. interestingly mobile home parks that are in proximity to other places that people litter are usually in worse condition, whereas mobile home parks in rural areas sometimes do not have littering problems like those closer to towns/cities.",building=static_caravan,120,14
    mob,mobile money agent,,amenity=mobile_money_agent,40,14
    mob,mobile phone shop,"can be a contributing factor, I have cleaned up around many boost mobile/cricket mobile/other no-contract mobile phone stores.",shop=mobile_phone,40,14
    mof,mofs,"this tag is for pedestrian paths, it is used to denote pedestrian paths in europe.",mofa=yes,40,12
    mot,motels,"motels are sometimes used for illicit purposes and the people who do those activities here sometimes litter. also, homeless people who litter will sometimes stay at a motel when they make enough money panhandling on the street. ",tourism=motel,140,0
    nar,narrow alley,"this tag is missing a partner tag for alley, but alleyways are usually places that people can get away with littering, and business owners usually own the alley and are hesitant to spend their own resources cleaning up other peoples waste.",narrow=yes,80,16
    nat,nature reserve,need to include proximity to other factors for this to be significant,leisure=nature_reserve,40,16
    nat,nature trail entrance,this access tag is important to include. i have seen littering at entrances to hiking trails and other trails frequently.,"sac_scale=hiking, access=destination, hiking=yes, designation=public_footpath, route=hiking",40,point
    nei,neighboring apartments,i was trying to figure out how to make a tag that refered to proximity of two apartments,"building=residential, highway=residential",120,intersection
    nig,nightclub,nightlife as mentioned before can occur in areas where there is more littering,amenity=nightclub,80,
    no ,no address,"included this out of interest, but it may not be usable",noaddress=yes,0,
    no ,no drinking water,this tag combo would give you any place that does not have drinking water. those types of places are more likely to not have trash service and thus littering can be an issue there,"place=*, building=*, leisure=*, drinking_water=no",60,
    no ,no waste basket,"this tag needs to be combined with bus stops, train stops, trail entrances and more, it is a very valuble tag that indicates that that place has no trash receptical. thus, anyone disposing of trash there does so by littering.",bin=no,60,
    oth,other picnic shelter,picnic shelters can be locations for litter,shelter_type=picnic_shelter,60,
    out,outdoor seating,this is duplicate tag that needs to be deleted.,outdoor_seating=yes,60,
    oxb,oxbow,"it would be amazing if this tag were used on any smaller stream with an oxbow. it looks like in practice, the tag is used for larger waterways, but on smaller streams that carry litter, the oxbow in the stream is where the trash often collects. ",water=oxbow,4000,6
    par,park and ride,these park and ride lots can be prone to being trashed. I have cleaned up around several park and ride lots before.,park_ride=yes,120,
    par,parking,just general parking can be minor factor on littering in the area,amenity=parking,80,
    par,parking,just general parking can be minor factor on littering in the area,"site=parking, building=parking",80,
    pat,paths,these path tags are great for identifying places where littering can happen from foot traffic,"highway=footway, highway=path, bicycle=use_sidepath",60,line
    pav,paved path,"these paved paths as mentioned before have many different tags, so we would make sure to use all of them. unfortunately there is not one single unifying tag.","bicycle=designated, motor_vehicle=no, highway=pedestrian, cycleway=lane",60,line
    paw,pawn shop,pawn shops dont necessarily have litter on their premises but are usually in areas with a higher likelihood,shop=trade,120,
    paw,pawn shop also,pawn shops dont necessarily have litter on their premises but are usually in areas with a higher likelihood,shop=pawnbroker,120,
    per,perennial stream,"this is a stream that dries up. i have cleaned up many streams like this that are nearby cities, and in conjunction with other factors in proximity to them they could be great places to potentially clean up.",stream=perennial,400,
    pic,picnic table,in combination with other factors these are places that people litter,"leisure=picnic_table, tourism=picnic_site",40,
    pie,pier,"not always, but ocassionally the under pier area of beach can be a place where litter is found",man_made=pier,20,
    pla,plastic,"need to investigate what this tag refers to more, will return to see if it signifies a structure made out of plastic or what, but it could potentially be a tag for highly polluted area, I just need to check",material=plastic,0,
    pow,powerline,"these ""cuts"" are privately owned which means they are not maintained by the city, and therefore they are places people do illegal dumping of waste and make homeless encampments. ",man_made=cutline,15,
    pro,promenade ,a walking only street is a likely place that littering occurs however they could be well maintained or in a place that culturally does not accept littering. it is a minor factor.,living_street=yes,80,
    pro,proposed construction,"places in transition are usually overlooked, and the opportunity of development there can mean they came from a place of disuse or neglect",proposed=residential,80,
    pub,public park,"public parks can be locations of littering, they have varied maintence levels",leisure=playground,120,8
    pub,public restroom,public restrooms are sometimes used by the homeless to bathe and they can be in proximity to places of littering,amenity=toilets,60,
    pub,public toilets,public restrooms are sometimes used by the homeless to bathe and they can be in proximity to places of littering,building=toilets,60,
    pub,public transportation,this is associated with buses as before,type=public_transport,120,40
    rai,railroad easement,this is another railroad tag as before,landuse=railway,120,
    rai,railroad spur,"these railroad spurs are particularly important, because they always occur with a point of interest at the end of them. for instance the railroad spur in carrboro that services the UNC-CH coal plant was extremely extremely littered a couple of years ago. we cleaned up a couple hundred bags of trash from there.",service=spur,200,0
    rai,railway stop,railway stops are transit stops like bus stops. not too common in U.S. more so in other countries.,railway=stop,60,
    rep,reported location,not yet applicable but could be a hugely beneficial way of creating logic for predicting litter,(not on OSM),100,point
    res,rest stop and other,mentioned previously,site=stop_area,60,
    ret,retention basin,these places are specifically made to control water and run off and they usually see a contribution of litter because the rain carries it to them.,basin=retention,50,
    riv,river bank,"trash traveling down stream gets caught on river banks, but i am not sure how to use this tag",waterway=riverbank,50,
    rur,rural highway,"these roads usually have no maintenance and therefore if littering occurs there, it just builds up slowly and is rarely cleaned up",highway=rural,20,line
    sec,secluded roads/dead ends,"these places are vulnerable to illegal dumping, and this happens frequenly.",,30,polygon
    sec,second hand,thrift stores have been highly likely to be nearby places that litter. it seems something about less expensive resources that coincide with littering.,"second_hand=yes, shop=second_hand",400,16
    sho,shop operated by charity,"if these places operate to give jobs to the jobless, then they usually reside in areas that need cleaning. for instance in durham nearby the trosa headquarters we cleaned up a few neighborhoods.",shop=charity,400,16
    sho,shopping,places that provide single use plastic are factors however small that may be,"building=retail, shop=*, shop=clothes, landuse=shopping",40,polygon
    sho,shoreline lake,"this was mentioned before, this is a more specific shoreline tag for lakes only. the coastline tag may not be appropriate for lakes",water=lake,60,polygon
    sid,side street parking,side streets in general get less attention and more littering,parking=side_street,50,16
    sid,sidepath,"if there are many sidepaths tagged on osm, then this could be a very valuble tag for us. usually littering in a small city or town occurs from foot traffic, and people will ofter toss things on sidepaths small trails",foot=use_sidepath,50,0
    sid,sidewalk,not sure how to incorporate this because walkability can contribute to littering but it has a very small factor,,15,25
    ska,skateboard park,in some cases skate parks are close to locations that need cleanup,sport=skateboard,100,
    smo,smoking,places that permit smoking usually have cigarette butt littering problems,smoking=outside,30,
    smo,smoking,places that permit smoking usually have cigarette butt littering problems,smoking=yes,30,
    sto,storm water catch,this is a place where washing litter from streets can end up and become stuck,basin=detention,60,
    sto,stormwater drain,stormwater exits are places where trash washed from rain into drains can end up. this tag should be modified to target the exits rather an manholes.,manhole=drain,40,
    sto,stormwater pipe,need to check of applicability but places that are tagged with stormwater pipe are likely larger culverts and drainage areas associated with cities. ,"tunnel=culvert, waterway=drain, ",60,point
    str,stream,streams running from populated areas to natural ones usually include litter in them,waterway=stream,30,line
    str,stream from populated area,"this is an attempt at a tag pair that would give you specifically urban streams, but the former waterway=stream tag would also need to be used on its own, because its not likely all urban streams have the urban tag attached to them","waterway=stream, denotation=urban",40,line
    sub,subway entrance,I need more experience cleaning up in large cities to know if metro entrances can be a contributing factor. ,railway=subway_entrace,30,
    sun,sunset viewpoint,places that are tagged for people to watch the sunset or sunrise can capture lookouts and open parking areas. these places can be destinations for people who come and drink and litter or party and litter.,lit=sunset-sunrise,100,
    tat,tatoo shop,"small factor, but sometimes occur on sides of town that can be more littered",shop=tatoo,300,36
    thr,thrift store,duplicate tag see before but very important tag,shop=second_hand,40,4
    tid,tidal area,tidal areas are important because of the influx and outflow of water. they usually bring with them plastic and debris. ,tidal=yes,60,
    tob,tobacco shop,can be a source of litter,shop=tobacco,30,point
    tow,town,populated areas are more likely to be littered than the middle of some natural area but this need to be correlated with other tags,place=town,500,40
    tra,train route,"this is a tag which is a line with many points. it could be used to identify railroad inside populated areas however a complex logic would need to be applied to ignore railroad that exists far away from populated areas. it is primarily the foot traffic of those crossing the railroad that create the litter, sometimes homeless will choose places along railroads to make dwellings because they are railroad easement property that cannot be bothered by police.","route=train, route=railway",0,
    tra,train track,,light_rail=yes,50,polygon
    tra,tram stop,,railway=tram_stop,0,
    tra,trash,,waste=trash,60,0
    tro,trolley bus,,trolleybus=yes,0,0
    urb,urban tag,,denotation=urban,20,
    var,variety store,,shop=variety_store,100,12
    ven,vending,,"vending=public_transport_tickets, vending=drinks",60,
    vie,viewpoint,,tourism=viewpoint,90,0
    vis,visible trail,,trail_visibility=good,0,0
    wal,walmart,,name=walmart,60,polygon
    was,waste basket,,"amenity=waste_basket, bin=yes",40,4
    wat,water basin,,water=basin,100,2
    woo,wooded area near downtown,,"natural=wood, landcover=trees",40,polygon
    was,waste *,,waste=*,100,
    ,,,,,
    ,,,,,
    ,,,design=delta,,`; 

    let tagWeights = new Map();
    csv = csv.split("\n").slice(2); 

    for(row of csv){
        row += ','; 
        let values = []; 

        let start = 0; 
        let cell = 0; 
        let quoteCounter = 0; 
        let quoteType = 0; // 0 = single quote, 1 = double quote 
        for(let i = 0; i < row.length; i++){
            if(quoteCounter == 0 && row.charAt(i) == ','){
                if(cell == 1 || cell == 4 || cell == 5){
                    values.push(row.slice(start, i)); 
                }
                start = i + 1; 
                cell++; 
            }
            else if(row.charAt(i) == '\''){
                quoteCounter += (quoteType == 0) ? -1 : 1; 
                quoteType = 0; 
            }
            else if(row.charAt(i) == '\"'){
                quoteCounter += (quoteType == 1) ? -1 : 1; 
                quoteType = 1; 
            }
        }

        if(!Number.isNaN(Number(values[1])) && !Number.isNaN(Number(values[2]))){
            tagWeights.set(values[0].trim().replace(/ /g, '_'), [Number(values[1])/5280, Number(values[2])]); 
        }
    }

    return tagWeights;
}

function calculateWeights(tagWeights, tagMatrix, r, c, weightR, weightC){

    // Initialize weight matrix
    let weightMatrix = new Array(weightR * weightC); // weightMatrix will be smaller than tagMatrix because of the buffer zone from the radius
    for(let i = 0; i < weightMatrix.length; i++){
        weightMatrix[i] = 0; 
    }

    // Tag first
    for(let i = 0; i < tagMatrix.length; i++){
        for(let [tag, frequency] of tagMatrix[i].entries()){
            tag = tag.split(':')[0];
            let radius = tagWeights.has(tag) ? tagWeights.get(tag)[0] : 0;
            let weight = tagWeights.has(tag) ? (tagWeights.get(tag)[1] == 0 ? 1 : 1/tagWeights.get(tag)[1]) : 0;

            // Calculate the amount that the tag contributes to the current cell's weight
            for(let j = 0; j < weightMatrix.length; j++){
                let distance2 = Math.pow(j % weightC + (r - weightR)/2 - i % c, 2) + Math.pow(Math.floor(j / weightC) + (c - weightC)/2 - Math.floor(i / c), 2);
                if(distance2 < radius*radius){ // <=
                    weightMatrix[j] += (1 - Math.sqrt(distance2)/radius) * weight * frequency;
                }
            }
        }
    }

    // Normalize weights
    let maxWeight = 0;
    for(let i = 0; i < weightMatrix.length; i++){
        if(weightMatrix[i] > maxWeight){
            maxWeight = weightMatrix[i];
        }
    }
    if(maxWeight != 0){
        for(let i = 0; i < weightMatrix.length; i++){
            weightMatrix[i] /= maxWeight;
        }
    }

    return weightMatrix;
}
