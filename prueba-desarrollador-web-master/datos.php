<?php
class juego{
    public static function run() {
        $obj = new self();
        switch ($_POST['key']){
            case '1':
                $res = $obj->save_level();
                break;
            case '2':
                $res = $obj->resumen();
                break;
        }
        echo json_encode($res);
    }
    private function conexion() {
        $enlace = mysqli_connect("localhost", "root", "", "developer");
        if (!$enlace) {
            echo "Error: No se pudo conectar a MySQL." . PHP_EOL;
            echo "errno de depuración: " . mysqli_connect_errno() . PHP_EOL;
            echo "error de depuración: " . mysqli_connect_error() . PHP_EOL;
            return false;
        }
        return $enlace;
    }
    
    
    
    private function save_level() {
        $obj = new self();
        $res = array();
        $puntos_levels = array();
        $arr_init = json_decode($_POST['array']);
        $resp = json_decode($_POST['tecleo']);
        $nivel = 0;
        for($i=1; $i<count($resp); $i++){//recorrer lo que respondió
            $pos = count($resp[$i]);
            $puntos_levels[$pos] = 0;
            for($k=0; $k<$pos; $k++){//recorrer las posibles respuestas
                if($arr_init[$k] == $resp[$i][$k])$puntos_levels[$pos] ++; //comparar las respuestas
            }
            if($pos == 10) $nivel = $puntos_levels[$pos];//cantidad de respuestas correctas en el último nivel
        }
        if($con = $obj->conexion()){
            $sum = array_sum($puntos_levels);
            $name = $_POST['name_user'];
            $insert_user = mysqli_query($con,"insert into users (name) values ('$name')");//insertar el usuario 
            if($id_user = mysqli_insert_id($con)){
                $insert_puntaje = mysqli_query($con,"insert into puntaje (id_user, puntaje, nivel) values ($id_user, $sum, $nivel)");//insertar el puntaje
            }else{
                echo 'no inserta';
            }
            
        }
        $res['puntos_level'] = $puntos_levels;
        $res['suma'] = $sum;
        $res['nivel'] = $nivel;
        $res['puestos'] = $obj->resumen();
        return $res;        
    }
    
    
    private function resumen() {
        $obj = new self();
        $res = array();
        if($con = $obj->conexion()){
            if ($resultado = mysqli_query($con, 'SELECT DISTINCT p.*, u.name
                                                    FROM puntaje p 
                                                    JOIN users u ON u.id = p.id_user
                                                    ORDER BY p.puntaje DESC LIMIT 5')) {
                while ($row = mysqli_fetch_assoc($resultado)) $res[] = $row;
                //mysqli_free_result($resultado);
            }
        }
        return $res;
        
    }
}
juego::run();