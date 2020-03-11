/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var array_keys = [];//array de las teclas a seleccionar
var intera = 0; //interacción para iniciar
var level = 0; //nivel actual del juego
var tecleo_level = []; // array de las selecciones del usuario
class juego{
    
    /*
     * Crear array
     * @returns {Generator}
     */
    aleatorio_array(){
        for(var i = 65; i<=90; i++)
            array_keys.push(i);
        array_keys.sort(function() {return Math.random() - 0.5}); // volver aleatorio el array
        var node = document.createElement("div"); 
        node.innerHTML = 'Click o enter para iniciar el juego';
        node.id = 'nivel';
        document.getElementsByTagName('body')[0].appendChild(node);
        ju.add_func();
    }
    /*
     * iniciar el juego con interacción tecla
     * @returns {Generator}
     */
    interaccion_tecla(event){
        var tecla = event.which || event.keyCode;
        if(intera == 0){ 
            intera = 1 ;
            ju.init_level();
        }else{
            ju.tecleo(tecla);
        }
    }
    
    interaccion_mouse(c){
        if(intera == 0){ 
            intera = 1 ;
            ju.init_level(1);
        }else{
            ju.tecleo(c);   
        } 
    }
    /*
     * Guardar en array las selecciones del usuario
     * @param {int} t
     * @returns {Generator}
     */
    tecleo(t){
        tecleo_level[level].push(t);
        tecleo_level[level].length < (level) ? '': ju.reiniciar();
    }
    
    /*
     * Iniciar nivel del juego
     * @returns {Generator}
     */
    init_level(mouse = 0){
        mouse == 1 ? document.getElementsByTagName('body')[0].removeAttribute("onclick"): '';
        level ++;
        tecleo_level[level] = [];
        document.getElementById('nivel').innerHTML = 'Nivel: '+ (level) + ' dijite o d&eacute click en las teclas correspondientes';
        var keys = document.getElementsByClassName('key');
        for(var i = 0; i<keys.length; i++){
            keys[i].setAttribute("onclick", "ju.interaccion_mouse(this.dataset.key);");
            for(var k = 0; k<level; k++){
                if(array_keys[k] == keys[i].dataset.key){
                    keys[i].style.backgroundColor = "#adadad";
                    
                }
            }
        }
    }
    /*
     * Limpiar tablero y reiniciar
     * @returns {Generator}
     */
    reiniciar(){
        var keys = document.getElementsByClassName('key');
        for(var i = 0; i<keys.length; i++){
            keys[i].style.backgroundColor = "transparent";
        }
        if(level <10){
            document.getElementById('nivel').innerHTML = "Fin del nivel "+level;
            ju.remove_func();
            setTimeout(function(){ ju.add_func(); ju.init_level(); }, 600);
        }else{
            ju.remove_func();
            document.getElementById('nivel').innerHTML = 'Finalizado<br>'+
                    'Digite su nombre: '+
                    '<div id="name_user" contenteditable="true" style="  border: solid 1px #fff;  width: 50%; margin: 5px;"></div> '+
                    '<button type="button" class="btn btn-success" onclick="ju.save_data();">Registrarme</button>';
        }
    }
    
    
    remove_func(){
        document.getElementsByTagName('body')[0].removeAttribute("onkeydown");
        var keys = document.getElementsByClassName('key');
        for(var i = 0; i<keys.length; i++) keys[i].removeAttribute("onclick");
    }
    add_func(){
        document.getElementsByTagName('body')[0].setAttribute("onkeydown", "ju.interaccion_tecla(event);");
    }
    /*
     * Guardar los datos
     * @type type
     */
    save_data(){
        var name = document.getElementById('name_user').innerHTML;
        if(name != ""){
            var formData = new FormData();
            formData.append("key", "1");
            formData.append("name_user", name);
            formData.append("tecleo", JSON.stringify(tecleo_level));
            formData.append("array", JSON.stringify(array_keys));

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var json = JSON.parse(this.responseText);
                    var ht = '';
                    for(var k =0; k<json['puestos'].length; k++) ht += '<li>'+json['puestos'][k]['name']+': '+json['puestos'][k]['puntaje']+'</li>';
                    document.getElementById('nivel').innerHTML = name+' su puntaje total es: '+json['suma'] +' su nivel es: '+json['nivel'] +'<br><ol>'+ht+'</ol><br>Pulse F5 para reiniciar el juego';
                }
            };
            xhttp.open("POST", "datos.php", true );
            xhttp.send(formData);
        }
            
    }
}
var ju = new juego();
