package next.school.cesar.projeto_m3.repositories;

import next.school.cesar.projeto_m3.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByMatriculaIn(List<String> matriculas);
    Optional<Usuario> findByMatricula(String matricula);
    boolean existsByMatricula(String matricula);
    long countByCentroCusto(String centroCusto);
    List<Usuario> findByStatusUsuarioDescricao(String statusUsuarioDescricao);
    Optional<Usuario> findByEmail(String email);
    
}
