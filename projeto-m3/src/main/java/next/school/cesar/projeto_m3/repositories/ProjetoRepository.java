package next.school.cesar.projeto_m3.repositories;

import next.school.cesar.projeto_m3.entities.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    long countByCentroCusto(String centroCusto);
    boolean existsByMatricula(String matricula);
    Optional<Projeto> findByMatricula(String matricula);
    List<Projeto> findByStatusProjeto(String statusProjeto);

    @Query("SELECT p FROM Projeto p WHERE "
            + "(:status IS NULL OR p.statusProjeto = :status) AND "
            + "(:gerenteMatricula IS NULL OR p.idUsuario.matricula = :gerenteMatricula) AND "
            + "(:nome IS NULL OR p.nome LIKE %:nome%) AND "
            + "(:centroCusto IS NULL OR p.centroCusto = :centroCusto) AND "
            + "(:dtInicio IS NULL OR p.dtInicio = :dtInicio) AND "
            + "(:dtTerminoPrevista IS NULL OR p.dtTerminoPrevista = :dtTerminoPrevista) AND "
            + "(:orcamento IS NULL OR p.orcamento = :orcamento) AND "
            + "(:flags IS NULL OR p.flags = :flags) AND "
            + "(:matricula IS NULL OR p.matricula = :matricula) AND "
            + "(:descricao IS NULL OR p.descricao LIKE %:descricao%)")
    List<Projeto> findProjetosByMultipleCriteria(
            @Param("status") String status,
            @Param("gerenteMatricula") String gerenteMatricula,
            @Param("nome") String nome,
            @Param("centroCusto") String centroCusto,
            @Param("dtInicio") Date dtInicio,
            @Param("dtTerminoPrevista") Date dtTerminoPrevista,
            @Param("orcamento") Double orcamento,
            @Param("flags") String flags,
            @Param("matricula") String matricula,
            @Param("descricao") String descricao);
}
