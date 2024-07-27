package next.school.cesar.projeto_m3.entities;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projetos")
public class Projeto implements Serializable {
	
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_projeto")
    private Long idProjeto;
    
    @Size(min = 3, max = 50)
    @Column(nullable = false)
    private String nome;
    
    @Size(min = 2, max = 50)
    @Column(name = "centro_custo", nullable = false)
    private String centroCusto;

    @Column(nullable = false, unique = true)
    private String matricula;
    
    @Column(name = "dt_inicio", nullable = false)
    private Date dtInicio;

    @Column(name = "dt_termino_prevista", nullable = false)
    private Date dtTerminoPrevista;

    @Size(max = 20)
    @Column(name = "status_projeto")
    private String statusProjeto;

    @Column
    private double orcamento;

    @Size(max = 255)
    @Column
    private String descricao;

    @Column
    private String flags;

    @ManyToOne
    @JoinColumn(name = "id_gerente")
    private Usuario idUsuario;

    @ManyToOne
    @JoinColumn(name = "id_equipe")
    private Equipe equipe;
}
