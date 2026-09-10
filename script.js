function formuGonder(event) {
    
    event.preventDefault();

    
    let ad = document.getElementById("musteriAd").value;
    let eposta = document.getElementById("musteriEposta").value;
    let proje = document.getElementById("musteriProje").value;

    
    let mesajKutusu = document.getElementById("basariMesaji");

    
    if (ad && eposta && proje) {
        
        mesajKutusu.innerHTML = "Teşekkürler Sayın <strong>" + ad + "</strong>! Talebiniz alındı. " + eposta + " adresine bilgilendirme geçeceğiz.";
        mesajKutusu.style.display = "block";

        
        document.getElementById("teklifFormu").reset();
    }
}
