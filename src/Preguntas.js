// Fichero con todos los arrays correpondientes a las preguntas del cuestionario
// Cada array contiene una pregunta, las posibles respuestas, y el indice de la respuesta correcta


//Preguntas de Aquaterra
const Preguntas_AquaTerra =[
    ['AquaTerra',['Pulparians','Aquarians','Tiburonions','Pecerians'],1],
    ['Los Aquarians',['Son seres anfibios adaptados a la vida marina','Son mitad pulpo mitad robot','Son humanos que siempre van en bañador','Son microorganismos como algas'],0],
    ['Los Aquarians es una sociedad basada en la cooperación y la conservación del medio ambiente marino.',['Verdadero','Falso'],0],
    ['La temperatura de Aquaterra ronda los...',['0 grados Celsius','100 grados Celsius','-10 grados Celsius','25 grados Celsius'],3],
    ['En los arrecifes de coral de Aquaterra podemos encontrar...',['una increíble variedad de especies marinas','Barcos hundidos','Piratas y tesoros','Pulpos parlantes'],1],
    ['La atmosfera de Aquaterra esta compuesta de oxígeno y nitrógeno, similar a la tierra',['Verdadero','Falso'],0],
    ['En el abismo profundo podemos descubrir...',['tesoros hundidos','a los Aquarians','algas','criaturas extrañas que han evolucionado para sobrevivir en la oscuridad'],3],
    ['La ciudad submarina es...',['una metrópolis futurista construida en las profundidades del océano','el hogar de las ballenas','el lugar donde viven las medusas','una ciudad abandonada'],0],
    ['En la cueva de los secretos...',['viven los Aquarians','puedes descubrir antiguos enigmas','se esconden los grandes cetáceos','encuentras a los más sabios de los Aquarians'],1],
    ['En el santuario de los cetáceos',['viven la mayoría de las grandes ballenas de Aquaterra','viven las medusas de colores','hace mucho frío','se escuchan cantos de sirena'],0]
];


//Preguntas de Alcyon
const Preguntas_Alcyon =[
    ['¿Cómo se llaman los habitantes de Alcyon?',['Alcyonitas','Alcyonenseros','Alcyonans','Alcynios'],2],
    ['Los Alcyonans son...',['Seres de piedra','Mitad humano y mitad ave','Seres acuáticos','Seres inmortales'],1],
    ['Alcyon tiene un clima templado y estable.',['Verdadero','Falso'],0],
    ['¿De qué está compuesta la atmósfera de Alcyon?',['Principalmente de oxígeno y nitrógeno','De óxido de azufre','De gases tóxicos','De hidrógeno'],1],
    ['¿Cómo se llaman las ciudades donde viven los Alcyonans?',['Ciudades de fuego','Ciudades sumergidas','Ciudades de aire','Ciudades flotantes'],3],
    ['Las ciudades flotantes pueden ser vulnerables a fuertes vientos y tormentas eléctricas.',['Verdadero','Falso'],0],
    ['La selva de cristal...',['Es una densa selva donde los árboles emiten llamas','Es una densa selva donde los árboles están formados por cristales','Es una densa selva donde los pájaros hablan nuestro idioma','Todas son correctas'],1],
    ['En el mar de nubes....',['Hay islas flotantes ocultas','Viven los Alcyonans','No hay nubes','Puedes bañarte en agua templada'],0],
    ['El valle de los vientos',['Está abandonado','Es un valle desértico','Es una ciudad submarina','Es un lugar ideal para volar'],3],
    ['El santuario de las alas es un lugar sagrado para los Alcyonans',['Verdadero','Falso'],0]
];


//Preguntas de Zephyria
const Preguntas_Zephyria =[
    ['¿Cómo se llaman los habitantes de Zephyria?',['Zefirindos','Zephyrians','Todos se llaman Zeferio!','Zepherinos'],1],
    ['Los Zephyrians han desarrollado una sociedad armoniosa y pacífica en equilibrio con el entorno.',['Verdadero','Falso'],0],
    ['El planeta Zephyria tiene una temperatura media por el día de aproximadamente...',['-5 grados centígrados','50 grados centígrados','30 grados centígrados','0 grados centígrados'],2],
    ['La selva más grande del planeta se llama...',['La Selva Esmeralda','El Amazonas Zephyriano','La Selva Zafiro','La jungla de Cristal'],0],
    ['¿El Valle de los Susurros es lugar de criaturas mágicas?',['Verdadero','Falso'],0],
    ['La atmósfera del planeta Zephyria está compuesta principalmente de...',['Hidrógeno','oxígeno y nitrógeno','Gases nocivos','No tiene atmósfera'],1],
    ['Aunque Zephyria puede parecer exuberante y hermoso, también presenta numerosos peligros, como...',['Dinosaurios carnívoros','Monstruos de fuego','Plantas carnívoras y depredadores','Gnomos mutantes'],2],
    ['El pantano de la noche eterna...',['Es oscuro y siniestro. La luz apenas penetra entre los árboles','Es un lugar luminoso y colorido','Ideal para merendar a la luz del sol','Siempre es de día en este pantano'],0],
    ['En el bosque de cristal los árboles...',['Son azules y rojo','Cantan','Son artificiales','Brillan bajo la luz de la luna'],3],
    ['En la Cordillera de las Nubes es posible descubrir antiguos templos y santuarios escondidos entre la neblina.',['Verdadero','Falso'],0]
];


//Preguntas de Ignis
const Preguntas_Ignis =[
    ['Ignis',['Pulparians','Aquarians','Tiburonions','Pecerians'],1],
    ['Los Aquarians',['Son seres anfibios adaptados a la vida marina','Son mitad pulpo mitad robot','Son humanos que siempre van en bañador','Son microorganismos como algas'],0],
    ['Los Aquarians es una sociedad basada en la cooperación y la conservación del medio ambiente marino.',['Verdadero','Falso'],0],
    ['La temperatura de Aquaterra ronda los...',['0 grados Celsius','100 grados Celsius','-10 grados Celsius','25 grados Celsius'],3],
    ['En los arrecifes de coral de Aquaterra podemos encontrar...',['una increíble variedad de especies marinas','Barcos hundidos','Piratas y tesoros','Pulpos parlantes'],1],
    ['La atmosfera de Aquaterra esta compuesta de oxígeno y nitrógeno, similar a la tierra',['Verdadero','Falso'],0],
    ['En el abismo profundo podemos descubrir...',['tesoros hundidos','a los Aquarians','algas','criaturas extrañas que han evolucionado para sobrevivir en la oscuridad'],3],
    ['La ciudad submarina es...',['una metrópolis futurista construida en las profundidades del océano','el hogar de las ballenas','el lugar donde viven las medusas','una ciudad abandonada'],0],
    ['En la cueva de los secretos...',['viven los Aquarians','puedes descubrir antiguos enigmas','se esconden los grandes cetáceos','encuentras a los más sabios de los Aquarians'],1],
    ['En el santuario de los cetáceos',['viven la mayoría de las grandes ballenas de Aquaterra','viven las medusas de colores','hace mucho frío','se escuchan cantos de sirena'],0]
];


//Preguntas de Mechanon
const Preguntas_Mechanon =[
    ['¿Cuál es el nombre de la especie dominante del planeta Mechanon?',['Mechanerds','Mechanoids','Mechaniacs','Mecheros'],1],
    ['Los Mechanoids son seres...',['mitad máquina y mitad carne.','acuáticos','de piedra','voladores'],0],
    ['¿Mechanon tiene una temperatura extrema?',['Verdadero','Falso'],0],
    ['¿De qué elementos se compone la atmósfera de Mechanon?',['Principalemte de alumínio','De dióxido de carbono','De gases inertes y vapor de agua en cantidades mínimas','De azufre'],3],
    ['La presión atmosférica en Mechanon es aproximadamente un 10% de la presión atmosférica terrestre',['Verdadero','Falso'],1],
    ['¿Cómo se llama el principal desierto de Mechanon?',['El desierto de cristal','El desierto de cobre','El desierto de arena','El desierto de fuego'],1],
    ['¿Cómo se llaman las ciudades donde viven los Mechanoids?',['Las Mechacities','ciudades de metal','Las ciudades del desierto','Las ciudades mecánicas'],3],
    ['En el bosque de los circuitos los árboles están formados por estructuras metálicas retorcidas',['Verdadero','Falso'],0],
    ['¿Dónde podemos ir para descubrir los secretos de la civilización Mechanoid?',['A la sima de los datos','Al mar de aluminio','A la ciudad mecánica','Al desierto de cobre'],0],
    ['Las criaturas en Mechanon son mayoritariamente',['mitad vegetal y mitad humana','cibernéticas','de fuego y metal','de acero'],0]
];


//Preguntas de Nymboria
const Preguntas_Nymboria =[
    ['Nymboria',['Pulparians','Aquarians','Tiburonions','Pecerians'],1],
    ['Los Aquarians',['Son seres anfibios adaptados a la vida marina','Son mitad pulpo mitad robot','Son humanos que siempre van en bañador','Son microorganismos como algas'],0],
    ['Los Aquarians es una sociedad basada en la cooperación y la conservación del medio ambiente marino.',['Verdadero','Falso'],0],
    ['La temperatura de Aquaterra ronda los...',['0 grados Celsius','100 grados Celsius','-10 grados Celsius','25 grados Celsius'],3],
    ['En los arrecifes de coral de Aquaterra podemos encontrar...',['una increíble variedad de especies marinas','Barcos hundidos','Piratas y tesoros','Pulpos parlantes'],1],
    ['La atmosfera de Aquaterra esta compuesta de oxígeno y nitrógeno, similar a la tierra',['Verdadero','Falso'],0],
    ['En el abismo profundo podemos descubrir...',['tesoros hundidos','a los Aquarians','algas','criaturas extrañas que han evolucionado para sobrevivir en la oscuridad'],3],
    ['La ciudad submarina es...',['una metrópolis futurista construida en las profundidades del océano','el hogar de las ballenas','el lugar donde viven las medusas','una ciudad abandonada'],0],
    ['En la cueva de los secretos...',['viven los Aquarians','puedes descubrir antiguos enigmas','se esconden los grandes cetáceos','encuentras a los más sabios de los Aquarians'],1],
    ['En el santuario de los cetáceos',['viven la mayoría de las grandes ballenas de Aquaterra','viven las medusas de colores','hace mucho frío','se escuchan cantos de sirena'],0]
];

export {Preguntas_AquaTerra,Preguntas_Alcyon,Preguntas_Zephyria,Preguntas_Ignis,Preguntas_Mechanon,Preguntas_Nymboria};