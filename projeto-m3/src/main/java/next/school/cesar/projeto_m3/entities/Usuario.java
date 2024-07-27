package next.school.cesar.projeto_m3.entities;

import java.io.Serializable;
import java.util.Date;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuarios")
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;
    
    @Size(min = 3, max = 20)
    @Column(nullable = false, unique = true)
    private String matricula;
    
    @Size(min = 3, max = 50)
    @Column(nullable = false)
    private String nome;
    
    @Size(min = 3, max = 50)
    @Column(name = "ultimo_nome", nullable = false)
    private String ultimoNome;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "dt_nascimento")
    private Date dtNascimento;
    
    @Email
    @Size(max = 100)
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Size(min = 2, max = 50)
    @Column(name = "centro_custo", nullable = false)
    private String centroCusto;
    
    
    @Column(name = "status_usuario")
    private String statusUsuarioDescricao;   
    
    @Transient
    private boolean statusUsuario;
}
