abstract class LlmBase {

    abstract concreteModel: any;

    //Methode pour generer le code final
    abstract process(): string;

    //Initialisation du modele
    abstract init(): boolean;



}